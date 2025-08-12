from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from datetime import datetime

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("/", response_model=schemas.APIResponse)
async def get_notifications(
    page: int = 1,
    limit: int = 20,
    unread_only: bool = False,
    category: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    )
    
    if unread_only:
        query = query.filter(models.Notification.read_at.is_(None))
    
    if category:
        query = query.filter(models.Notification.category == category)
    
    query = query.order_by(models.Notification.created_at.desc())
    
    total = query.count()
    notifications = query.offset((page - 1) * limit).limit(limit).all()
    
    notifications_data = []
    for notification in notifications:
        notification_dict = {
            "id": notification.id,
            "title": notification.title,
            "message": notification.message,
            "type": notification.type,
            "category": notification.category,
            "priority": notification.priority,
            "read_at": notification.read_at,
            "action_url": notification.action_url,
            "action_text": notification.action_text,
            "expires_at": notification.expires_at,
            "meta_data": notification.meta_data,
            "created_at": notification.created_at
        }
        notifications_data.append(notification_dict)
    
    unread_count = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.read_at.is_(None)
    ).count()
    
    return schemas.APIResponse(
        success=True,
        message="Notifications retrieved successfully",
        data={
            "notifications": notifications_data,
            "total": total,
            "unread_count": unread_count,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    )

@router.post("/", response_model=schemas.APIResponse)
async def create_notification(
    notification_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.admin:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can create notifications"
        )
    
    user_id = notification_data.get("user_id")
    title = notification_data.get("title")
    message = notification_data.get("message")
    notification_type = notification_data.get("type", "info")
    category = notification_data.get("category", "general")
    priority = notification_data.get("priority", "medium")
    action_url = notification_data.get("action_url")
    action_text = notification_data.get("action_text")
    expires_at = notification_data.get("expires_at")
    meta_data = notification_data.get("meta_data", {})
    
    if not user_id or not title or not message:
        raise HTTPException(
            status_code=400,
            detail="User ID, title, and message are required"
        )
    
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="Target user not found"
        )
    
    new_notification = models.Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        category=category,
        priority=priority,
        action_url=action_url,
        action_text=action_text,
        expires_at=expires_at,
        meta_data=meta_data
    )
    
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    
    return schemas.APIResponse(
        success=True,
        message="Notification created successfully",
        data={
            "notification_id": new_notification.id,
            "user_id": user_id,
            "title": title
        }
    )

@router.put("/{notification_id}/read", response_model=schemas.APIResponse)
async def mark_notification_as_read(
    notification_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )
    
    if notification.read_at is None:
        notification.read_at = datetime.utcnow()
        db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Notification marked as read",
        data={
            "notification_id": notification_id,
            "read_at": notification.read_at
        }
    )

@router.put("/mark-all-read", response_model=schemas.APIResponse)
async def mark_all_notifications_as_read(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    unread_notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.read_at.is_(None)
    ).all()
    
    count = 0
    for notification in unread_notifications:
        notification.read_at = datetime.utcnow()
        count += 1
    
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message=f"Marked {count} notifications as read",
        data={
            "marked_count": count
        }
    )

@router.delete("/{notification_id}", response_model=schemas.APIResponse)
async def delete_notification(
    notification_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )
    
    db.delete(notification)
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Notification deleted successfully",
        data={
            "notification_id": notification_id
        }
    )

@router.get("/stats", response_model=schemas.APIResponse)
async def get_notification_stats(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    total_notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).count()
    
    unread_notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.read_at.is_(None)
    ).count()
    
    categories_stats = db.query(
        models.Notification.category,
        db.func.count(models.Notification.id).label('count')
    ).filter(
        models.Notification.user_id == current_user.id
    ).group_by(models.Notification.category).all()
    
    categories_data = {}
    for category, count in categories_stats:
        categories_data[category] = count
    
    priority_stats = db.query(
        models.Notification.priority,
        db.func.count(models.Notification.id).label('count')
    ).filter(
        models.Notification.user_id == current_user.id
    ).group_by(models.Notification.priority).all()
    
    priority_data = {}
    for priority, count in priority_stats:
        priority_data[priority] = count
    
    return schemas.APIResponse(
        success=True,
        message="Notification statistics retrieved successfully",
        data={
            "total_notifications": total_notifications,
            "unread_notifications": unread_notifications,
            "read_notifications": total_notifications - unread_notifications,
            "categories": categories_data,
            "priorities": priority_data
        }
    )

@router.post("/broadcast", response_model=schemas.APIResponse)
async def broadcast_notification(
    broadcast_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.admin:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can broadcast notifications"
        )
    
    title = broadcast_data.get("title")
    message = broadcast_data.get("message")
    notification_type = broadcast_data.get("type", "info")
    category = broadcast_data.get("category", "announcement")
    priority = broadcast_data.get("priority", "medium")
    target_role = broadcast_data.get("target_role")  # "all", "admin", "client"
    
    if not title or not message:
        raise HTTPException(
            status_code=400,
            detail="Title and message are required"
        )
    
    query = db.query(models.User)
    if target_role and target_role != "all":
        query = query.filter(models.User.role == target_role)
    
    target_users = query.all()
    
    notifications_created = 0
    for user in target_users:
        new_notification = models.Notification(
            user_id=user.id,
            title=title,
            message=message,
            type=notification_type,
            category=category,
            priority=priority
        )
        db.add(new_notification)
        notifications_created += 1
    
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message=f"Broadcast notification sent to {notifications_created} users",
        data={
            "notifications_created": notifications_created,
            "target_role": target_role or "all"
        }
    )
