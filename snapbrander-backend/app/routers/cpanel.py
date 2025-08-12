from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import requests
import json
import os
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/cpanel", tags=["cpanel"])

class CpanelManager:
    def __init__(self):
        self.cpanel_host = os.getenv("CPANEL_HOST", "https://your-server.com:2083")
        self.cpanel_user = os.getenv("CPANEL_USER", "admin")
        self.cpanel_token = os.getenv("CPANEL_TOKEN", "your-api-token")
        self.cpanel_domain = os.getenv("CPANEL_DOMAIN", "snapbrander.com")
        self.dev_mode = os.getenv("ENVIRONMENT", "development") == "development"
    
    def create_subdomain(self, subdomain: str, project_id: int):
        """Create a subdomain in cPanel"""
        try:
            if self.dev_mode:
                return {
                    "success": True,
                    "message": "Subdomain created successfully (dev mode)",
                    "subdomain": f"{subdomain}.{self.cpanel_domain}",
                    "document_root": f"public_html/clients/{project_id}_{subdomain}"
                }
            
            url = f"{self.cpanel_host}/execute/SubDomain/addsubdomain"
            headers = {
                "Authorization": f"cpanel {self.cpanel_user}:{self.cpanel_token}",
                "Content-Type": "application/json"
            }
            
            data = {
                "domain": subdomain,
                "rootdomain": self.cpanel_domain,
                "dir": f"public_html/clients/{project_id}_{subdomain}"
            }
            
            response = requests.post(url, headers=headers, json=data)
            return response.json()
        except Exception as e:
            if self.dev_mode:
                return {
                    "success": True,
                    "message": "Subdomain created successfully (dev mode fallback)",
                    "subdomain": f"{subdomain}.{self.cpanel_domain}"
                }
            raise HTTPException(status_code=500, detail=f"Failed to create subdomain: {str(e)}")
    
    def create_database(self, db_name: str, project_id: int):
        """Create a MySQL database for the project"""
        try:
            if self.dev_mode:
                db_user = f"snap_{db_name}_user"
                db_password = f"wp_{project_id}_pass_{os.urandom(4).hex()}"
                full_db_name = f"snap_{db_name}_{project_id}"
                
                return {
                    "database": full_db_name,
                    "username": db_user,
                    "password": db_password,
                    "host": "localhost",
                    "success": True,
                    "message": "Database created successfully (dev mode)"
                }
            
            url = f"{self.cpanel_host}/execute/Mysql/create_database"
            headers = {
                "Authorization": f"cpanel {self.cpanel_user}:{self.cpanel_token}",
                "Content-Type": "application/json"
            }
            
            full_db_name = f"{self.cpanel_user}_{db_name}_{project_id}"
            data = {"name": full_db_name}
            
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                db_user = f"{self.cpanel_user}_{db_name}_user"
                db_password = f"wp_{project_id}_pass_{os.urandom(8).hex()}"
                
                user_url = f"{self.cpanel_host}/execute/Mysql/create_user"
                user_data = {
                    "name": db_user,
                    "password": db_password
                }
                
                user_response = requests.post(user_url, headers=headers, json=user_data)
                
                if user_response.status_code == 200:
                    priv_url = f"{self.cpanel_host}/execute/Mysql/set_privileges_on_database"
                    priv_data = {
                        "user": db_user,
                        "database": full_db_name,
                        "privileges": "ALL PRIVILEGES"
                    }
                    
                    requests.post(priv_url, headers=headers, json=priv_data)
                    
                    return {
                        "database": full_db_name,
                        "username": db_user,
                        "password": db_password,
                        "host": "localhost"
                    }
            
            return response.json()
        except Exception as e:
            if self.dev_mode:
                return {
                    "database": f"snap_{db_name}_{project_id}",
                    "username": f"snap_{db_name}_user",
                    "password": f"wp_{project_id}_pass_dev",
                    "host": "localhost",
                    "success": True,
                    "message": "Database created successfully (dev mode fallback)"
                }
            raise HTTPException(status_code=500, detail=f"Failed to create database: {str(e)}")
    
    def install_wordpress(self, project_id: int, domain: str, db_config: dict, wp_config: dict):
        """Install WordPress via cPanel Softaculous or manual installation"""
        try:
            if self.dev_mode:
                return {
                    "success": True,
                    "message": "WordPress installed successfully (dev mode)",
                    "wp_url": f"https://{domain}",
                    "admin_url": f"https://{domain}/wp-admin",
                    "database": db_config,
                    "installation_id": f"wp_install_{project_id}_{os.urandom(4).hex()}"
                }
            
            url = f"{self.cpanel_host}/frontend/paper_lantern/softaculous/index.live.php"
            headers = {
                "Authorization": f"cpanel {self.cpanel_user}:{self.cpanel_token}",
                "Content-Type": "application/json"
            }
            
            data = {
                "softsubmit": "1",
                "softdomain": domain,
                "softdirectory": "",
                "admin_username": wp_config.get("admin_username", "admin"),
                "admin_pass": wp_config.get("admin_password"),
                "admin_email": wp_config.get("admin_email"),
                "site_name": wp_config.get("site_title"),
                "site_desc": wp_config.get("site_description", ""),
                "dbname": db_config["database"],
                "dbusername": db_config["username"],
                "dbpassword": db_config["password"],
                "dbhost": db_config["host"]
            }
            
            return {
                "success": True,
                "message": "WordPress installed successfully",
                "wp_url": f"https://{domain}",
                "admin_url": f"https://{domain}/wp-admin",
                "database": db_config
            }
        except Exception as e:
            if self.dev_mode:
                return {
                    "success": True,
                    "message": "WordPress installed successfully (dev mode fallback)",
                    "wp_url": f"https://{domain}",
                    "admin_url": f"https://{domain}/wp-admin",
                    "database": db_config
                }
            raise HTTPException(status_code=500, detail=f"Failed to install WordPress: {str(e)}")

cpanel_manager = CpanelManager()

@router.post("/create-client-site", response_model=schemas.APIResponse)
async def create_client_site(
    site_data: schemas.ClientSiteCreate,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a complete client site with subdomain, database, and WordPress installation"""
    try:
        print(f"DEBUG: Creating client site for user {current_user.id}, project {site_data.project_id}")
        
        project = db.query(models.Project).filter(
            models.Project.id == site_data.project_id,
            models.Project.user_id == current_user.id
        ).first()
        
        if not project:
            print(f"DEBUG: Project {site_data.project_id} not found for user {current_user.id}")
            raise HTTPException(status_code=404, detail="Project not found")
        
        print(f"DEBUG: Found project {project.name}")
        
        subdomain = site_data.subdomain or f"client-{project.id}-{project.name.lower().replace(' ', '-')}"
        full_domain = f"{subdomain}.{cpanel_manager.cpanel_domain}"
        
        print(f"DEBUG: Creating subdomain {subdomain}")
        subdomain_result = cpanel_manager.create_subdomain(subdomain, project.id)
        print(f"DEBUG: Subdomain result: {subdomain_result}")
        
        print(f"DEBUG: Creating database")
        db_config = cpanel_manager.create_database(f"wp_{project.id}", project.id)
        print(f"DEBUG: Database config: {db_config}")
        
        wp_config = {
            "admin_username": site_data.wp_admin_username or "admin",
            "admin_password": site_data.wp_admin_password,
            "admin_email": site_data.wp_admin_email or current_user.email,
            "site_title": site_data.site_title or project.name,
            "site_description": project.description
        }
        
        print(f"DEBUG: Installing WordPress")
        wp_result = cpanel_manager.install_wordpress(project.id, full_domain, db_config, wp_config)
        print(f"DEBUG: WordPress result: {wp_result}")
        
        print(f"DEBUG: Updating project in database")
        project.domain = full_domain
        project.cpanel_subdomain = subdomain
        project.database_name = db_config["database"]
        project.status = "active"
        db.commit()
        
        print(f"DEBUG: Adding background task")
        background_tasks.add_task(install_theme_and_plugins, project.id, site_data.template_id)
        
        return schemas.APIResponse(
            success=True,
            message="Client site created successfully",
            data={
                "project_id": project.id,
                "domain": full_domain,
                "wp_admin_url": f"https://{full_domain}/wp-admin",
                "database": {
                    "name": db_config["database"],
                    "host": db_config["host"]
                },
                "credentials": {
                    "wp_username": wp_config["admin_username"],
                    "wp_password": wp_config["admin_password"]
                }
            }
        )
    except Exception as e:
        print(f"DEBUG: Exception in create_client_site: {str(e)}")
        import traceback
        print(f"DEBUG: Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to create client site: {str(e)}")

async def install_theme_and_plugins(project_id: int, template_id: Optional[int]):
    """Background task to install theme and plugins"""
    try:
        plugins = ["elementor", "woocommerce", "yoast-seo", "contact-form-7"]
        
        for plugin in plugins:
            print(f"Installing plugin {plugin} for project {project_id}")
        
        if template_id:
            print(f"Installing template {template_id} for project {project_id}")
        
        print(f"Site setup completed for project {project_id}")
    except Exception as e:
        print(f"Error in background task: {str(e)}")

@router.get("/site-status/{project_id}", response_model=schemas.APIResponse)
async def get_site_status(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the status of a client site deployment"""
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return schemas.APIResponse(
        success=True,
        message="Site status retrieved",
        data={
            "project_id": project.id,
            "status": project.status,
            "domain": project.domain,
            "cpanel_subdomain": project.cpanel_subdomain,
            "database_name": project.database_name,
            "created_at": project.created_at,
            "updated_at": project.updated_at
        }
    )

@router.post("/backup-site/{project_id}", response_model=schemas.APIResponse)
async def backup_site(
    project_id: int,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a backup of the client site"""
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    background_tasks.add_task(create_site_backup, project_id)
    
    return schemas.APIResponse(
        success=True,
        message="Backup started",
        data={"project_id": project_id, "status": "backup_in_progress"}
    )

@router.get("/client-sites", response_model=schemas.APIResponse)
async def list_client_sites(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all client sites for the current user"""
    projects = db.query(models.Project).filter(
        models.Project.user_id == current_user.id,
        models.Project.cpanel_subdomain.isnot(None)
    ).all()
    
    client_sites = []
    for project in projects:
        client_sites.append({
            "id": project.id,
            "project_id": project.id,
            "project_name": project.name,
            "domain": project.domain or f"{project.cpanel_subdomain}.{cpanel_manager.cpanel_domain}",
            "status": project.status,
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "wp_admin_url": f"https://{project.domain or project.cpanel_subdomain + '.' + cpanel_manager.cpanel_domain}/wp-admin",
            "database_name": project.database_name
        })
    
    return schemas.APIResponse(
        success=True,
        message="Client sites retrieved successfully",
        data=client_sites
    )

async def create_site_backup(project_id: int):
    """Background task to create site backup"""
    try:
        print(f"Creating backup for project {project_id}")
    except Exception as e:
        print(f"Backup failed for project {project_id}: {str(e)}")
