from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/dashboard", response_model=schemas.APIResponse)
async def get_dashboard_analytics(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    total_projects = db.query(models.Project).filter(
        models.Project.user_id == current_user.id
    ).count()
    
    active_projects = db.query(models.Project).filter(
        models.Project.user_id == current_user.id,
        models.Project.status == models.ProjectStatus.active
    ).count()
    
    dashboard_data = {
        "overview": {
            "total_projects": total_projects,
            "active_projects": active_projects,
            "total_visitors": 15420,
            "total_pageviews": 45680,
            "average_bounce_rate": 42.5,
            "average_session_duration": "2:45"
        },
        "recent_activity": [
            {
                "type": "project_created",
                "message": "تم إنشاء مشروع جديد",
                "project_name": "موقع الشركة الجديد",
                "timestamp": (datetime.now() - timedelta(hours=2)).isoformat()
            },
            {
                "type": "template_applied",
                "message": "تم تطبيق قالب جديد",
                "project_name": "متجر إلكتروني",
                "timestamp": (datetime.now() - timedelta(hours=5)).isoformat()
            },
            {
                "type": "domain_connected",
                "message": "تم ربط نطاق جديد",
                "project_name": "مدونة شخصية",
                "timestamp": (datetime.now() - timedelta(days=1)).isoformat()
            }
        ],
        "performance_metrics": {
            "avg_load_time": 1.2,
            "uptime_percentage": 99.8,
            "ssl_coverage": 100,
            "mobile_friendly_score": 95
        }
    }
    
    return schemas.APIResponse(
        success=True,
        message="Dashboard analytics retrieved successfully",
        data=dashboard_data
    )

@router.get("/project/{project_id}", response_model=schemas.APIResponse)
async def get_project_analytics(
    project_id: int,
    period: str = "30d",  # 7d, 30d, 90d, 1y
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
    
    days = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}.get(period, 30)
    
    daily_data = []
    base_visitors = 50
    for i in range(days):
        date = datetime.now() - timedelta(days=days-i-1)
        visitors = base_visitors + random.randint(-20, 40)
        pageviews = visitors * random.randint(2, 5)
        daily_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "visitors": visitors,
            "pageviews": pageviews,
            "bounce_rate": round(random.uniform(30, 60), 1),
            "avg_session_duration": f"{random.randint(1, 4)}:{random.randint(10, 59):02d}"
        })
    
    analytics_data = {
        "project_id": project_id,
        "project_name": project.name,
        "period": period,
        "summary": {
            "total_visitors": sum(day["visitors"] for day in daily_data),
            "total_pageviews": sum(day["pageviews"] for day in daily_data),
            "avg_bounce_rate": round(sum(day["bounce_rate"] for day in daily_data) / len(daily_data), 1),
            "unique_visitors": int(sum(day["visitors"] for day in daily_data) * 0.8),
            "returning_visitors": int(sum(day["visitors"] for day in daily_data) * 0.2)
        },
        "daily_data": daily_data,
        "top_pages": [
            {"page": "/", "visitors": 1250, "pageviews": 2100, "bounce_rate": 35.2},
            {"page": "/about", "visitors": 890, "pageviews": 1200, "bounce_rate": 42.1},
            {"page": "/services", "visitors": 650, "pageviews": 980, "bounce_rate": 38.7},
            {"page": "/contact", "visitors": 420, "pageviews": 520, "bounce_rate": 55.3},
            {"page": "/blog", "visitors": 380, "pageviews": 750, "bounce_rate": 28.9}
        ],
        "traffic_sources": [
            {"source": "Direct", "visitors": 45, "percentage": 45.0},
            {"source": "Google", "visitors": 30, "percentage": 30.0},
            {"source": "Social Media", "visitors": 15, "percentage": 15.0},
            {"source": "Referral", "visitors": 10, "percentage": 10.0}
        ],
        "devices": [
            {"device": "Desktop", "visitors": 55, "percentage": 55.0},
            {"device": "Mobile", "visitors": 35, "percentage": 35.0},
            {"device": "Tablet", "visitors": 10, "percentage": 10.0}
        ],
        "countries": [
            {"country": "Egypt", "visitors": 60, "percentage": 60.0},
            {"country": "Saudi Arabia", "visitors": 20, "percentage": 20.0},
            {"country": "UAE", "visitors": 10, "percentage": 10.0},
            {"country": "Other", "visitors": 10, "percentage": 10.0}
        ]
    }
    
    return schemas.APIResponse(
        success=True,
        message="Project analytics retrieved successfully",
        data=analytics_data
    )

@router.get("/revenue", response_model=schemas.APIResponse)
async def get_revenue_analytics(
    period: str = "30d",
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.admin:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can access revenue analytics"
        )
    
    revenue_data = {
        "period": period,
        "total_revenue": 125000.00,
        "monthly_recurring_revenue": 45000.00,
        "average_revenue_per_user": 250.00,
        "churn_rate": 5.2,
        "growth_rate": 15.8,
        "subscription_breakdown": [
            {"plan": "Basic", "subscribers": 150, "revenue": 15000.00},
            {"plan": "Pro", "subscribers": 80, "revenue": 24000.00},
            {"plan": "Enterprise", "subscribers": 20, "revenue": 30000.00}
        ],
        "monthly_data": [
            {"month": "2024-01", "revenue": 38000, "new_customers": 25, "churned_customers": 3},
            {"month": "2024-02", "revenue": 42000, "new_customers": 30, "churned_customers": 2},
            {"month": "2024-03", "revenue": 45000, "new_customers": 28, "churned_customers": 4},
            {"month": "2024-04", "revenue": 48000, "new_customers": 32, "churned_customers": 3},
            {"month": "2024-05", "revenue": 52000, "new_customers": 35, "churned_customers": 2}
        ]
    }
    
    return schemas.APIResponse(
        success=True,
        message="Revenue analytics retrieved successfully",
        data=revenue_data
    )

@router.get("/users", response_model=schemas.APIResponse)
async def get_user_analytics(
    period: str = "30d",
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.admin:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can access user analytics"
        )
    
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(
        models.User.status == models.UserStatus.active
    ).count()
    
    user_data = {
        "period": period,
        "total_users": total_users,
        "active_users": active_users,
        "new_users_this_month": 45,
        "user_growth_rate": 12.5,
        "average_projects_per_user": 2.3,
        "user_activity": [
            {"date": "2024-08-01", "new_users": 8, "active_users": 120},
            {"date": "2024-08-02", "new_users": 12, "active_users": 125},
            {"date": "2024-08-03", "new_users": 6, "active_users": 118},
            {"date": "2024-08-04", "new_users": 15, "active_users": 135},
            {"date": "2024-08-05", "new_users": 9, "active_users": 128}
        ],
        "user_segments": [
            {"segment": "Free Users", "count": 200, "percentage": 66.7},
            {"segment": "Basic Plan", "count": 60, "percentage": 20.0},
            {"segment": "Pro Plan", "count": 30, "percentage": 10.0},
            {"segment": "Enterprise", "count": 10, "percentage": 3.3}
        ]
    }
    
    return schemas.APIResponse(
        success=True,
        message="User analytics retrieved successfully",
        data=user_data
    )

@router.get("/performance", response_model=schemas.APIResponse)
async def get_performance_analytics(
    project_id: Optional[int] = None,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if project_id:
        project = db.query(models.Project).filter(
            models.Project.id == project_id,
            models.Project.user_id == current_user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )
        
        performance_data = {
            "project_id": project_id,
            "project_name": project.name,
            "overall_score": project.performance_score or 85,
            "metrics": {
                "first_contentful_paint": 1.2,
                "largest_contentful_paint": 2.1,
                "first_input_delay": 45,
                "cumulative_layout_shift": 0.08,
                "speed_index": 1.8
            },
            "recommendations": [
                "ضغط الصور لتحسين سرعة التحميل",
                "تفعيل التخزين المؤقت للمتصفح",
                "تحسين كود CSS و JavaScript",
                "استخدام CDN لتسريع التحميل"
            ]
        }
    else:
        user_projects = db.query(models.Project).filter(
            models.Project.user_id == current_user.id
        ).all()
        
        avg_performance = sum(p.performance_score or 85 for p in user_projects) / len(user_projects) if user_projects else 85
        
        performance_data = {
            "overall_performance": avg_performance,
            "total_projects": len(user_projects),
            "projects_performance": [
                {
                    "project_id": p.id,
                    "project_name": p.name,
                    "performance_score": p.performance_score or 85,
                    "status": p.status.value
                } for p in user_projects
            ]
        }
    
    return schemas.APIResponse(
        success=True,
        message="Performance analytics retrieved successfully",
        data=performance_data
    )

@router.get("/seo", response_model=schemas.APIResponse)
async def get_seo_analytics(
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
    
    seo_data = {
        "project_id": project_id,
        "project_name": project.name,
        "seo_score": 78,
        "issues": [
            {"type": "warning", "message": "بعض الصفحات تفتقر لوصف meta"},
            {"type": "error", "message": "عناوين H1 مكررة في صفحتين"},
            {"type": "info", "message": "يمكن تحسين سرعة التحميل"}
        ],
        "keywords": [
            {"keyword": "تصميم مواقع", "position": 12, "search_volume": 1200},
            {"keyword": "شركة تقنية", "position": 8, "search_volume": 800},
            {"keyword": "خدمات ويب", "position": 15, "search_volume": 600}
        ],
        "backlinks": {
            "total": 45,
            "dofollow": 32,
            "nofollow": 13,
            "referring_domains": 28
        },
        "technical_seo": {
            "mobile_friendly": True,
            "ssl_certificate": True,
            "sitemap_exists": True,
            "robots_txt_exists": True,
            "page_speed_score": 85
        }
    }
    
    return schemas.APIResponse(
        success=True,
        message="SEO analytics retrieved successfully",
        data=seo_data
    )
