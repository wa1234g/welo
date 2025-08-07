from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"])

@router.get("/plans", response_model=schemas.APIResponse)
async def get_subscription_plans(db: Session = Depends(get_db)):
    plans = [
        {
            "id": "basic",
            "name_en": "Basic Plan",
            "name_ar": "الخطة الأساسية",
            "description_en": "Perfect for individuals and small projects",
            "description_ar": "مثالية للأفراد والمشاريع الصغيرة",
            "monthly_price": 29.99,
            "yearly_price": 299.99,
            "currency": "EGP",
            "projects_limit": 3,
            "storage_limit_gb": 5,
            "features": {
                "templates": True,
                "ai_generation": True,
                "custom_domain": False,
                "priority_support": False,
                "advanced_analytics": False
            },
            "status": "active"
        },
        {
            "id": "pro",
            "name_en": "Pro Plan",
            "name_ar": "الخطة الاحترافية",
            "description_en": "Best for growing businesses and agencies",
            "description_ar": "الأفضل للشركات النامية والوكالات",
            "monthly_price": 79.99,
            "yearly_price": 799.99,
            "currency": "EGP",
            "projects_limit": 15,
            "storage_limit_gb": 25,
            "features": {
                "templates": True,
                "ai_generation": True,
                "custom_domain": True,
                "priority_support": True,
                "advanced_analytics": True
            },
            "status": "active"
        },
        {
            "id": "enterprise",
            "name_en": "Enterprise Plan",
            "name_ar": "خطة المؤسسات",
            "description_en": "For large organizations with advanced needs",
            "description_ar": "للمؤسسات الكبيرة ذات الاحتياجات المتقدمة",
            "monthly_price": 199.99,
            "yearly_price": 1999.99,
            "currency": "EGP",
            "projects_limit": -1,
            "storage_limit_gb": -1,
            "features": {
                "templates": True,
                "ai_generation": True,
                "custom_domain": True,
                "priority_support": True,
                "advanced_analytics": True,
                "white_label": True,
                "api_access": True
            },
            "status": "active"
        }
    ]
    
    return schemas.APIResponse(
        success=True,
        message="Subscription plans retrieved successfully",
        data={"plans": plans}
    )

@router.get("/current", response_model=schemas.APIResponse)
async def get_current_subscription(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    subscription = db.query(models.Subscription).filter(
        models.Subscription.user_id == current_user.id,
        models.Subscription.status == "active"
    ).first()
    
    if not subscription:
        return schemas.APIResponse(
            success=True,
            message="No active subscription found",
            data={"subscription": None}
        )
    
    subscription_data = {
        "id": subscription.id,
        "plan_id": subscription.plan_id,
        "status": subscription.status,
        "billing_cycle": subscription.billing_cycle,
        "amount": float(subscription.amount),
        "currency": subscription.currency,
        "current_period_start": subscription.current_period_start,
        "current_period_end": subscription.current_period_end,
        "auto_renew": subscription.auto_renew,
        "created_at": subscription.created_at
    }
    
    return schemas.APIResponse(
        success=True,
        message="Current subscription retrieved successfully",
        data={"subscription": subscription_data}
    )

@router.post("/subscribe", response_model=schemas.APIResponse)
async def subscribe_to_plan(
    plan_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    plan_id = plan_data.get("plan_id")
    billing_cycle = plan_data.get("billing_cycle", "monthly")
    
    if not plan_id:
        raise HTTPException(
            status_code=400,
            detail="Plan ID is required"
        )
    
    existing_subscription = db.query(models.Subscription).filter(
        models.Subscription.user_id == current_user.id,
        models.Subscription.status == "active"
    ).first()
    
    if existing_subscription:
        raise HTTPException(
            status_code=400,
            detail="User already has an active subscription"
        )
    
    plan_prices = {
        "basic": {"monthly": 29.99, "yearly": 299.99},
        "pro": {"monthly": 79.99, "yearly": 799.99},
        "enterprise": {"monthly": 199.99, "yearly": 1999.99}
    }
    
    if plan_id not in plan_prices:
        raise HTTPException(
            status_code=400,
            detail="Invalid plan ID"
        )
    
    amount = plan_prices[plan_id][billing_cycle]
    
    from datetime import datetime, timedelta
    import uuid
    
    current_period_start = datetime.utcnow()
    if billing_cycle == "monthly":
        current_period_end = current_period_start + timedelta(days=30)
    else:
        current_period_end = current_period_start + timedelta(days=365)
    
    new_subscription = models.Subscription(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        plan_id=plan_id,
        status="pending",
        billing_cycle=billing_cycle,
        amount=amount,
        currency="EGP",
        current_period_start=current_period_start,
        current_period_end=current_period_end,
        auto_renew=True
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return schemas.APIResponse(
        success=True,
        message="Subscription created successfully. Please complete payment.",
        data={
            "subscription_id": new_subscription.id,
            "amount": amount,
            "currency": "EGP",
            "payment_url": f"/payments/process?subscription_id={new_subscription.id}"
        }
    )

@router.get("/usage", response_model=schemas.APIResponse)
async def get_subscription_usage(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    subscription = db.query(models.Subscription).filter(
        models.Subscription.user_id == current_user.id,
        models.Subscription.status == "active"
    ).first()
    
    if not subscription:
        return schemas.APIResponse(
            success=False,
            message="No active subscription found"
        )
    
    projects_count = db.query(models.Project).filter(
        models.Project.user_id == current_user.id,
        models.Project.status != "deleted"
    ).count()
    
    plan_limits = {
        "basic": {"projects": 3, "storage_gb": 5},
        "pro": {"projects": 15, "storage_gb": 25},
        "enterprise": {"projects": -1, "storage_gb": -1}
    }
    
    limits = plan_limits.get(subscription.plan_id, plan_limits["basic"])
    
    usage_data = {
        "plan_id": subscription.plan_id,
        "projects": {
            "used": projects_count,
            "limit": limits["projects"],
            "percentage": (projects_count / limits["projects"] * 100) if limits["projects"] > 0 else 0
        },
        "storage": {
            "used_gb": 0.5,
            "limit_gb": limits["storage_gb"],
            "percentage": (0.5 / limits["storage_gb"] * 100) if limits["storage_gb"] > 0 else 0
        }
    }
    
    return schemas.APIResponse(
        success=True,
        message="Subscription usage retrieved successfully",
        data={"usage": usage_data}
    )

@router.post("/cancel", response_model=schemas.APIResponse)
async def cancel_subscription(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    subscription = db.query(models.Subscription).filter(
        models.Subscription.user_id == current_user.id,
        models.Subscription.status == "active"
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="No active subscription found"
        )
    
    subscription.auto_renew = False
    subscription.status = "cancelled"
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Subscription cancelled successfully",
        data={"cancelled_at": subscription.updated_at}
    )
