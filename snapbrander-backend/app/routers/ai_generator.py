from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
import uuid
import json
from datetime import datetime

router = APIRouter(prefix="/api/ai", tags=["ai-generator"])

@router.post("/generate-website", response_model=schemas.APIResponse)
async def generate_website(
    generation_data: dict,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    business_name = generation_data.get("business_name")
    business_type = generation_data.get("business_type")
    description = generation_data.get("description")
    target_audience = generation_data.get("target_audience")
    preferred_colors = generation_data.get("preferred_colors", [])
    features = generation_data.get("features", [])
    language = generation_data.get("language", "ar")
    
    if not business_name or not business_type:
        raise HTTPException(
            status_code=400,
            detail="Business name and type are required"
        )
    
    project_name = f"{business_name} - AI Generated"
    subdomain = f"{business_name.lower().replace(' ', '-')}-{int(datetime.now().timestamp())}"
    
    ai_generation_data = {
        "business_name": business_name,
        "business_type": business_type,
        "description": description,
        "target_audience": target_audience,
        "preferred_colors": preferred_colors,
        "features": features,
        "language": language,
        "generation_status": "processing",
        "ai_prompts": {
            "content_generation": f"Generate website content for {business_name}, a {business_type} business. Description: {description}. Target audience: {target_audience}. Language: {language}",
            "design_preferences": f"Colors: {preferred_colors}, Features: {features}"
        }
    }
    
    new_project = models.Project(
        user_id=current_user.id,
        name=project_name,
        subdomain=subdomain,
        description=f"AI-generated website for {business_name}",
        business_type=business_type,
        status=models.ProjectStatus.creating,
        ai_generation_data=ai_generation_data
    )
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    background_tasks.add_task(process_ai_generation, new_project.id, db)
    
    return schemas.APIResponse(
        success=True,
        message="AI website generation started successfully",
        data={
            "project_id": new_project.id,
            "estimated_completion_time": "5-10 minutes",
            "status": "processing"
        }
    )

@router.get("/generation-status/{project_id}", response_model=schemas.APIResponse)
async def get_generation_status(
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
    
    ai_data = project.ai_generation_data or {}
    generation_status = ai_data.get("generation_status", "unknown")
    
    status_data = {
        "project_id": project_id,
        "status": generation_status,
        "progress_percentage": ai_data.get("progress_percentage", 0),
        "current_step": ai_data.get("current_step", "Initializing"),
        "estimated_completion": ai_data.get("estimated_completion"),
        "generated_content": ai_data.get("generated_content", {}),
        "errors": ai_data.get("errors", [])
    }
    
    return schemas.APIResponse(
        success=True,
        message="Generation status retrieved successfully",
        data=status_data
    )

@router.post("/regenerate-content", response_model=schemas.APIResponse)
async def regenerate_content(
    regeneration_data: dict,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project_id = regeneration_data.get("project_id")
    content_type = regeneration_data.get("content_type")  # "homepage", "about", "services", etc.
    custom_prompt = regeneration_data.get("custom_prompt")
    
    if not project_id or not content_type:
        raise HTTPException(
            status_code=400,
            detail="Project ID and content type are required"
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
    
    ai_data = project.ai_generation_data or {}
    ai_data["regeneration_request"] = {
        "content_type": content_type,
        "custom_prompt": custom_prompt,
        "requested_at": datetime.utcnow().isoformat()
    }
    
    project.ai_generation_data = ai_data
    db.commit()
    
    background_tasks.add_task(regenerate_specific_content, project_id, content_type, custom_prompt, db)
    
    return schemas.APIResponse(
        success=True,
        message="Content regeneration started successfully",
        data={
            "project_id": project_id,
            "content_type": content_type,
            "status": "regenerating"
        }
    )

@router.get("/content-suggestions", response_model=schemas.APIResponse)
async def get_content_suggestions(
    business_type: str,
    language: str = "ar",
    db: Session = Depends(get_db)
):
    suggestions = {
        "business": {
            "pages": ["الرئيسية", "من نحن", "خدماتنا", "اتصل بنا"],
            "sections": ["البطل", "الخدمات", "الفريق", "الشهادات", "التواصل"],
            "features": ["نموذج اتصال", "خريطة الموقع", "معرض الصور", "المدونة"]
        },
        "ecommerce": {
            "pages": ["الرئيسية", "المنتجات", "سلة التسوق", "الدفع", "حسابي"],
            "sections": ["المنتجات المميزة", "الفئات", "العروض", "التقييمات"],
            "features": ["سلة التسوق", "الدفع الآمن", "تتبع الطلبات", "قائمة الأمنيات"]
        },
        "restaurant": {
            "pages": ["الرئيسية", "القائمة", "من نحن", "الحجوزات", "اتصل بنا"],
            "sections": ["الأطباق المميزة", "قائمة الطعام", "الشيف", "المراجعات"],
            "features": ["نظام الحجوزات", "قائمة الطعام", "الطلب أونلاين", "التقييمات"]
        },
        "portfolio": {
            "pages": ["الرئيسية", "أعمالي", "من أنا", "خدماتي", "اتصل بي"],
            "sections": ["معرض الأعمال", "المهارات", "الخبرات", "الشهادات"],
            "features": ["معرض الصور", "تحميل السيرة الذاتية", "نموذج التواصل", "المدونة"]
        }
    }
    
    business_suggestions = suggestions.get(business_type, suggestions["business"])
    
    return schemas.APIResponse(
        success=True,
        message="Content suggestions retrieved successfully",
        data={
            "business_type": business_type,
            "language": language,
            "suggestions": business_suggestions
        }
    )

@router.post("/customize-design", response_model=schemas.APIResponse)
async def customize_design(
    customization_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project_id = customization_data.get("project_id")
    design_changes = customization_data.get("design_changes", {})
    
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
    
    ai_data = project.ai_generation_data or {}
    ai_data["design_customizations"] = design_changes
    ai_data["last_customized"] = datetime.utcnow().isoformat()
    
    project.ai_generation_data = ai_data
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Design customization saved successfully",
        data={
            "project_id": project_id,
            "applied_changes": design_changes
        }
    )

async def process_ai_generation(project_id: int, db: Session):
    """Background task to process AI website generation"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        return
    
    try:
        ai_data = project.ai_generation_data or {}
        
        steps = [
            {"step": "Analyzing business requirements", "progress": 20},
            {"step": "Generating website structure", "progress": 40},
            {"step": "Creating content with AI", "progress": 60},
            {"step": "Applying design preferences", "progress": 80},
            {"step": "Finalizing website", "progress": 100}
        ]
        
        for step_data in steps:
            ai_data["current_step"] = step_data["step"]
            ai_data["progress_percentage"] = step_data["progress"]
            project.ai_generation_data = ai_data
            db.commit()
            
            import time
            time.sleep(2)
        
        generated_content = {
            "homepage": {
                "hero_title": f"مرحباً بكم في {ai_data.get('business_name', 'موقعنا')}",
                "hero_subtitle": "نقدم أفضل الخدمات لعملائنا الكرام",
                "about_section": "نحن شركة رائدة في مجال " + ai_data.get('business_type', 'الأعمال'),
                "services": ["خدمة متميزة", "دعم على مدار الساعة", "جودة عالية"]
            },
            "about": {
                "title": "من نحن",
                "content": f"تأسست {ai_data.get('business_name', 'شركتنا')} لتقديم أفضل الخدمات في مجال {ai_data.get('business_type', 'الأعمال')}."
            },
            "contact": {
                "title": "اتصل بنا",
                "address": "العنوان: القاهرة، مصر",
                "phone": "الهاتف: +20 123 456 7890",
                "email": "البريد الإلكتروني: info@example.com"
            }
        }
        
        ai_data["generated_content"] = generated_content
        ai_data["generation_status"] = "completed"
        ai_data["completed_at"] = datetime.utcnow().isoformat()
        
        project.ai_generation_data = ai_data
        project.status = models.ProjectStatus.active
        project.wp_url = f"https://{project.subdomain}.snapbrander.com"
        
        db.commit()
        
    except Exception as e:
        ai_data["generation_status"] = "failed"
        ai_data["errors"] = [str(e)]
        project.ai_generation_data = ai_data
        project.status = models.ProjectStatus.error
        db.commit()

async def regenerate_specific_content(project_id: int, content_type: str, custom_prompt: str, db: Session):
    """Background task to regenerate specific content"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        return
    
    try:
        ai_data = project.ai_generation_data or {}
        generated_content = ai_data.get("generated_content", {})
        
        import time
        time.sleep(3)
        
        if content_type == "homepage":
            generated_content["homepage"]["hero_title"] = f"عنوان جديد لـ {ai_data.get('business_name', 'الموقع')}"
            generated_content["homepage"]["hero_subtitle"] = custom_prompt or "وصف محدث بواسطة الذكاء الاصطناعي"
        
        ai_data["generated_content"] = generated_content
        ai_data["last_regenerated"] = datetime.utcnow().isoformat()
        
        project.ai_generation_data = ai_data
        db.commit()
        
    except Exception as e:
        ai_data["regeneration_errors"] = ai_data.get("regeneration_errors", [])
        ai_data["regeneration_errors"].append(str(e))
        project.ai_generation_data = ai_data
        db.commit()
