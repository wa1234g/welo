from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("/", response_model=schemas.APIResponse)
async def get_projects(
    status_filter: Optional[str] = Query(None, description="Filter by project status"),
    search: Optional[str] = Query(None, description="Search in project name or domain"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Project).filter(models.Project.user_id == current_user.id)
    
    if status_filter:
        query = query.filter(models.Project.status == status_filter)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Project.name.ilike(search_term),
                models.Project.domain.ilike(search_term),
                models.Project.subdomain.ilike(search_term)
            )
        )
    
    total = query.count()
    projects = query.offset((page - 1) * limit).limit(limit).all()
    
    projects_data = []
    for project in projects:
        project_dict = schemas.ProjectResponse.from_orm(project).dict()
        projects_data.append(project_dict)
    
    return schemas.APIResponse(
        success=True,
        message="Projects retrieved successfully",
        data={
            "projects": projects_data,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    )

@router.post("/", response_model=schemas.APIResponse)
async def create_project(
    project: schemas.ProjectCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if project.subdomain:
        existing_subdomain = db.query(models.Project).filter(
            models.Project.subdomain == project.subdomain
        ).first()
        if existing_subdomain:
            raise HTTPException(
                status_code=400,
                detail="Subdomain already exists"
            )
    
    if project.domain:
        existing_domain = db.query(models.Project).filter(
            models.Project.domain == project.domain
        ).first()
        if existing_domain:
            raise HTTPException(
                status_code=400,
                detail="Domain already exists"
            )
    
    db_project = models.Project(
        user_id=current_user.id,
        name=project.name,
        domain=project.domain,
        subdomain=project.subdomain,
        description=project.description,
        business_type=project.business_type,
        template_id=project.template_id,
        status=models.ProjectStatus.creating,
        settings=project.settings or {},
        ai_generation_data=project.ai_generation_data or {},
        seo_settings=project.seo_settings or {}
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    project_data = schemas.ProjectResponse.from_orm(db_project)
    
    return schemas.APIResponse(
        success=True,
        message="Project created successfully",
        data=project_data.dict()
    )

@router.get("/{project_id}", response_model=schemas.APIResponse)
async def get_project(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(
        and_(
            models.Project.id == project_id,
            models.Project.user_id == current_user.id
        )
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    project_data = schemas.ProjectResponse.from_orm(project)
    
    return schemas.APIResponse(
        success=True,
        message="Project retrieved successfully",
        data=project_data.dict()
    )

@router.put("/{project_id}", response_model=schemas.APIResponse)
async def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(
        and_(
            models.Project.id == project_id,
            models.Project.user_id == current_user.id
        )
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    update_data = project_update.dict(exclude_unset=True)
    
    if "subdomain" in update_data and update_data["subdomain"]:
        existing_subdomain = db.query(models.Project).filter(
            and_(
                models.Project.subdomain == update_data["subdomain"],
                models.Project.id != project_id
            )
        ).first()
        if existing_subdomain:
            raise HTTPException(
                status_code=400,
                detail="Subdomain already exists"
            )
    
    if "domain" in update_data and update_data["domain"]:
        existing_domain = db.query(models.Project).filter(
            and_(
                models.Project.domain == update_data["domain"],
                models.Project.id != project_id
            )
        ).first()
        if existing_domain:
            raise HTTPException(
                status_code=400,
                detail="Domain already exists"
            )
    
    for field, value in update_data.items():
        setattr(project, field, value)
    
    project.last_updated_at = models.func.now()
    db.commit()
    db.refresh(project)
    
    project_data = schemas.ProjectResponse.from_orm(project)
    
    return schemas.APIResponse(
        success=True,
        message="Project updated successfully",
        data=project_data.dict()
    )

@router.delete("/{project_id}", response_model=schemas.APIResponse)
async def delete_project(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(
        and_(
            models.Project.id == project_id,
            models.Project.user_id == current_user.id
        )
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    project.status = models.ProjectStatus.deleted
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Project deleted successfully"
    )

@router.post("/{project_id}/deploy", response_model=schemas.APIResponse)
async def deploy_project(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(
        and_(
            models.Project.id == project_id,
            models.Project.user_id == current_user.id
        )
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    if project.status == models.ProjectStatus.active:
        raise HTTPException(
            status_code=400,
            detail="Project is already deployed"
        )
    
    project.status = models.ProjectStatus.active
    project.last_updated_at = models.func.now()
    db.commit()
    db.refresh(project)
    
    project_data = schemas.ProjectResponse.from_orm(project)
    
    return schemas.APIResponse(
        success=True,
        message="Project deployed successfully",
        data=project_data.dict()
    )

@router.get("/{project_id}/stats", response_model=schemas.APIResponse)
async def get_project_stats(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(
        and_(
            models.Project.id == project_id,
            models.Project.user_id == current_user.id
        )
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    stats = {
        "visitors_count": project.visitors_count or 0,
        "performance_score": project.performance_score or 0,
        "security_score": project.security_score or 0,
        "ssl_status": project.ssl_status,
        "backup_enabled": project.backup_enabled,
        "monitoring_enabled": project.monitoring_enabled,
        "last_backup_at": project.last_backup_at.isoformat() if project.last_backup_at else None,
        "last_updated_at": project.last_updated_at.isoformat() if project.last_updated_at else None
    }
    
    return schemas.APIResponse(
        success=True,
        message="Project statistics retrieved successfully",
        data=stats
    )
