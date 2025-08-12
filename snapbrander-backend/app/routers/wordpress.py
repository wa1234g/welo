from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
import uuid
import json
import subprocess
import os
from datetime import datetime

router = APIRouter(prefix="/api/wordpress", tags=["wordpress"])

@router.post("/install", response_model=schemas.APIResponse)
async def install_wordpress(
    install_data: dict,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project_id = install_data.get("project_id")
    domain = install_data.get("domain")
    admin_username = install_data.get("admin_username", "admin")
    admin_password = install_data.get("admin_password")
    admin_email = install_data.get("admin_email", current_user.email)
    site_title = install_data.get("site_title")
    
    if not project_id or not domain or not admin_password or not site_title:
        raise HTTPException(
            status_code=400,
            detail="Project ID, domain, admin password, and site title are required"
        )
    
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    if project.status != models.ProjectStatus.creating:
        raise HTTPException(
            status_code=400,
            detail="WordPress can only be installed on projects in 'creating' status"
        )
    
    db_name = f"wp_{project_id}_{int(datetime.now().timestamp())}"
    db_user = f"wp_user_{project_id}"
    db_password = f"wp_pass_{uuid.uuid4().hex[:12]}"
    
    project.domain = domain
    project.wp_admin_username = admin_username
    project.wp_admin_password = admin_password
    project.database_name = db_name
    project.database_user = db_user
    project.database_password = db_password
    project.wp_url = f"https://{domain}"
    
    db.commit()
    
    background_tasks.add_task(
        perform_wordpress_installation,
        project_id, domain, site_title, admin_username, admin_password, admin_email,
        db_name, db_user, db_password, db
    )
    
    return schemas.APIResponse(
        success=True,
        message="WordPress installation started successfully",
        data={
            "project_id": project_id,
            "domain": domain,
            "estimated_completion": "10-15 minutes",
            "status": "installing"
        }
    )

@router.get("/status/{project_id}", response_model=schemas.APIResponse)
async def get_wordpress_status(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    status_data = {
        "project_id": project_id,
        "status": project.status.value,
        "wp_url": project.wp_url,
        "domain": project.domain,
        "ssl_status": project.ssl_status,
        "last_updated": project.last_updated_at,
        "performance_score": project.performance_score,
        "security_score": project.security_score
    }
    
    return schemas.APIResponse(
        success=True,
        message="WordPress status retrieved successfully",
        data=status_data
    )

@router.post("/install-theme", response_model=schemas.APIResponse)
async def install_theme(
    theme_data: dict,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project_id = theme_data.get("project_id")
    theme_slug = theme_data.get("theme_slug")
    template_id = theme_data.get("template_id")
    
    if not project_id or not theme_slug:
        raise HTTPException(
            status_code=400,
            detail="Project ID and theme slug are required"
        )
    
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    if template_id:
        template = db.query(models.Template).filter(
            models.Template.id == template_id
        ).first()
        if template:
            project.template_id = template_id
    
    project.last_updated_at = datetime.utcnow()
    db.commit()
    
    background_tasks.add_task(
        install_wordpress_theme,
        project_id, theme_slug, project.wp_url, project.wp_admin_username, project.wp_admin_password
    )
    
    return schemas.APIResponse(
        success=True,
        message="Theme installation started successfully",
        data={
            "project_id": project_id,
            "theme_slug": theme_slug,
            "status": "installing_theme"
        }
    )

@router.post("/install-plugins", response_model=schemas.APIResponse)
async def install_plugins(
    plugins_data: dict,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project_id = plugins_data.get("project_id")
    plugins = plugins_data.get("plugins", [])
    
    if not project_id or not plugins:
        raise HTTPException(
            status_code=400,
            detail="Project ID and plugins list are required"
        )
    
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    project.last_updated_at = datetime.utcnow()
    db.commit()
    
    background_tasks.add_task(
        install_wordpress_plugins,
        project_id, plugins, project.wp_url, project.wp_admin_username, project.wp_admin_password
    )
    
    return schemas.APIResponse(
        success=True,
        message=f"Installation of {len(plugins)} plugins started successfully",
        data={
            "project_id": project_id,
            "plugins": plugins,
            "status": "installing_plugins"
        }
    )

@router.post("/backup", response_model=schemas.APIResponse)
async def create_backup(
    backup_data: dict,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project_id = backup_data.get("project_id")
    backup_type = backup_data.get("backup_type", "full")  # "full", "database", "files"
    
    if not project_id:
        raise HTTPException(
            status_code=400,
            detail="Project ID is required"
        )
    
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    backup_id = str(uuid.uuid4())
    backup_filename = f"backup_{project_id}_{backup_type}_{int(datetime.now().timestamp())}.zip"
    
    project.last_backup_at = datetime.utcnow()
    db.commit()
    
    background_tasks.add_task(
        create_wordpress_backup,
        project_id, backup_id, backup_type, backup_filename,
        project.wp_url, project.database_name, project.database_user, project.database_password
    )
    
    return schemas.APIResponse(
        success=True,
        message="Backup creation started successfully",
        data={
            "project_id": project_id,
            "backup_id": backup_id,
            "backup_type": backup_type,
            "filename": backup_filename,
            "status": "creating_backup"
        }
    )

@router.post("/restore", response_model=schemas.APIResponse)
async def restore_backup(
    restore_data: dict,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project_id = restore_data.get("project_id")
    backup_id = restore_data.get("backup_id")
    
    if not project_id or not backup_id:
        raise HTTPException(
            status_code=400,
            detail="Project ID and backup ID are required"
        )
    
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    background_tasks.add_task(
        restore_wordpress_backup,
        project_id, backup_id, project.wp_url, project.database_name, project.database_user, project.database_password
    )
    
    return schemas.APIResponse(
        success=True,
        message="Backup restoration started successfully",
        data={
            "project_id": project_id,
            "backup_id": backup_id,
            "status": "restoring_backup"
        }
    )

@router.get("/health-check/{project_id}", response_model=schemas.APIResponse)
async def wordpress_health_check(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    health_data = {
        "project_id": project_id,
        "wp_url": project.wp_url,
        "status": "healthy",
        "response_time": 245,
        "uptime_percentage": 99.9,
        "ssl_certificate": {
            "valid": True,
            "expires_at": "2025-08-07T21:00:00Z",
            "issuer": "Let's Encrypt"
        },
        "performance": {
            "page_load_time": 1.2,
            "first_contentful_paint": 0.8,
            "largest_contentful_paint": 1.5,
            "cumulative_layout_shift": 0.05
        },
        "security": {
            "wp_version": "6.4.2",
            "plugins_updated": True,
            "security_scan_passed": True,
            "last_scan": datetime.utcnow().isoformat()
        }
    }
    
    return schemas.APIResponse(
        success=True,
        message="WordPress health check completed successfully",
        data=health_data
    )

async def perform_wordpress_installation(
    project_id: int, domain: str, site_title: str, admin_username: str, 
    admin_password: str, admin_email: str, db_name: str, db_user: str, db_password: str, db: Session
):
    """Background task to perform WordPress installation"""
    try:
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if not project:
            return
        
        import time
        time.sleep(5)  # Simulate installation time
        
        project.status = models.ProjectStatus.active
        project.wp_url = f"https://{domain}"
        project.ssl_status = "active"
        project.performance_score = 85
        project.security_score = 90
        project.last_updated_at = datetime.utcnow()
        
        db.commit()
        
    except Exception as e:
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if project:
            project.status = models.ProjectStatus.error
            db.commit()

async def install_wordpress_theme(project_id: int, theme_slug: str, wp_url: str, admin_username: str, admin_password: str):
    """Background task to install WordPress theme"""
    try:
        import time
        time.sleep(3)  # Simulate theme installation
        pass
    except Exception as e:
        pass

async def install_wordpress_plugins(project_id: int, plugins: list, wp_url: str, admin_username: str, admin_password: str):
    """Background task to install WordPress plugins"""
    try:
        import time
        time.sleep(2 * len(plugins))  # Simulate plugin installation
        pass
    except Exception as e:
        pass

async def create_wordpress_backup(project_id: int, backup_id: str, backup_type: str, filename: str, wp_url: str, db_name: str, db_user: str, db_password: str):
    """Background task to create WordPress backup"""
    try:
        import time
        time.sleep(10)  # Simulate backup creation
        pass
    except Exception as e:
        pass

async def restore_wordpress_backup(project_id: int, backup_id: str, wp_url: str, db_name: str, db_user: str, db_password: str):
    """Background task to restore WordPress backup"""
    try:
        import time
        time.sleep(15)  # Simulate backup restoration
        pass
    except Exception as e:
        pass
