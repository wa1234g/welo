from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/", response_model=schemas.APIResponse)
async def search_content(
    q: str = Query(..., description="Search query"),
    type: Optional[str] = Query(None, description="Content type filter"),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    """Search across projects, templates, and other content"""
    try:
        results = []
        
        if not type or type == "project":
            projects = db.query(models.Project).filter(
                models.Project.name.contains(q) |
                models.Project.description.contains(q) |
                models.Project.business_type.contains(q)
            ).limit(limit).all()
            
            for project in projects:
                results.append({
                    "id": project.id,
                    "type": "project",
                    "title": project.name,
                    "description": project.description or "",
                    "url": f"/my-projects/{project.id}",
                    "metadata": {
                        "status": project.status,
                        "domain": project.domain,
                        "business_type": project.business_type,
                        "created_at": project.created_at.isoformat()
                    }
                })
        
        if not type or type == "template":
            templates = db.query(models.Template).filter(
                models.Template.name.contains(q) |
                models.Template.description.contains(q) |
                models.Template.category.contains(q)
            ).limit(limit).all()
            
            for template in templates:
                results.append({
                    "id": template.id,
                    "type": "template",
                    "title": template.name,
                    "description": template.description or "",
                    "url": f"/templates/{template.id}",
                    "metadata": {
                        "category": template.category,
                        "price": float(template.price) if template.price else 0,
                        "rating": float(template.rating) if template.rating else 0,
                        "downloads": template.downloads_count,
                        "preview_image": template.preview_image
                    }
                })
        
        return schemas.APIResponse(
            success=True,
            message=f"Found {len(results)} results",
            data={
                "results": results,
                "query": q,
                "total": len(results)
            }
        )
    except Exception as e:
        return schemas.APIResponse(
            success=False,
            message=f"Search failed: {str(e)}"
        )
