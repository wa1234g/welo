from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/templates", tags=["templates"])

@router.get("/", response_model=schemas.APIResponse)
async def get_templates(
    category: Optional[str] = Query(None, description="Filter by category"),
    is_premium: Optional[bool] = Query(None, description="Filter by premium status"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured status"),
    search: Optional[str] = Query(None, description="Search in template name"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=50, description="Items per page"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Template).filter(models.Template.status == "active")
    
    if category:
        query = query.filter(models.Template.category == category)
    
    if is_premium is not None:
        query = query.filter(models.Template.is_premium == is_premium)
    
    if is_featured is not None:
        query = query.filter(models.Template.is_featured == is_featured)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Template.name.ilike(search_term),
                models.Template.name_ar.ilike(search_term),
                models.Template.description.ilike(search_term),
                models.Template.description_ar.ilike(search_term)
            )
        )
    
    query = query.order_by(models.Template.is_featured.desc(), models.Template.downloads_count.desc())
    
    total = query.count()
    templates = query.offset((page - 1) * limit).limit(limit).all()
    
    templates_data = []
    for template in templates:
        template_dict = schemas.TemplateResponse.from_orm(template).dict()
        templates_data.append(template_dict)
    
    return schemas.APIResponse(
        success=True,
        message="Templates retrieved successfully",
        data={
            "templates": templates_data,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    )

@router.get("/categories", response_model=schemas.APIResponse)
async def get_template_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Template.category).filter(
        models.Template.status == "active",
        models.Template.category.isnot(None)
    ).distinct().all()
    
    category_list = [cat[0] for cat in categories if cat[0]]
    
    return schemas.APIResponse(
        success=True,
        message="Template categories retrieved successfully",
        data={"categories": category_list}
    )

@router.get("/featured", response_model=schemas.APIResponse)
async def get_featured_templates(
    limit: int = Query(6, ge=1, le=20, description="Number of featured templates"),
    db: Session = Depends(get_db)
):
    templates = db.query(models.Template).filter(
        models.Template.status == "active",
        models.Template.is_featured == True
    ).order_by(models.Template.downloads_count.desc()).limit(limit).all()
    
    templates_data = []
    for template in templates:
        template_dict = schemas.TemplateResponse.from_orm(template).dict()
        templates_data.append(template_dict)
    
    return schemas.APIResponse(
        success=True,
        message="Featured templates retrieved successfully",
        data={"templates": templates_data}
    )

@router.get("/{template_id}", response_model=schemas.APIResponse)
async def get_template(
    template_id: int,
    db: Session = Depends(get_db)
):
    template = db.query(models.Template).filter(
        models.Template.id == template_id,
        models.Template.status == "active"
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )
    
    template_data = schemas.TemplateResponse.from_orm(template)
    
    return schemas.APIResponse(
        success=True,
        message="Template retrieved successfully",
        data=template_data.dict()
    )

@router.post("/{template_id}/download", response_model=schemas.APIResponse)
async def download_template(
    template_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    template = db.query(models.Template).filter(
        models.Template.id == template_id,
        models.Template.status == "active"
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )
    
    template.downloads_count += 1
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Template download initiated successfully",
        data={
            "template_id": template_id,
            "download_url": template.file_path,
            "file_size_mb": float(template.file_size_mb) if template.file_size_mb else 0
        }
    )

@router.get("/{template_id}/preview", response_model=schemas.APIResponse)
async def get_template_preview(
    template_id: int,
    db: Session = Depends(get_db)
):
    template = db.query(models.Template).filter(
        models.Template.id == template_id,
        models.Template.status == "active"
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )
    
    preview_data = {
        "template_id": template_id,
        "name": template.name,
        "name_ar": template.name_ar,
        "preview_image": template.preview_image,
        "gallery_images": template.gallery_images or [],
        "demo_url": template.demo_url,
        "description": template.description,
        "description_ar": template.description_ar,
        "features": template.customization_options or {},
        "compatible_business_types": template.compatible_business_types or [],
        "required_plugins": template.required_plugins or [],
        "included_plugins": template.included_plugins or []
    }
    
    return schemas.APIResponse(
        success=True,
        message="Template preview retrieved successfully",
        data=preview_data
    )
