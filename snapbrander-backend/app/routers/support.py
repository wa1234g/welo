from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from datetime import datetime
import uuid
import json

router = APIRouter(prefix="/api/support", tags=["support"])

class TicketStatus:
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriority:
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

@router.post("/tickets", response_model=schemas.APIResponse)
async def create_support_ticket(
    ticket_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    subject = ticket_data.get("subject")
    message = ticket_data.get("message")
    category = ticket_data.get("category", "general")
    priority = ticket_data.get("priority", TicketPriority.MEDIUM)
    project_id = ticket_data.get("project_id")
    
    if not subject or not message:
        raise HTTPException(
            status_code=400,
            detail="Subject and message are required"
        )
    
    ticket_id = str(uuid.uuid4())
    ticket_number = f"SNAP-{int(datetime.now().timestamp())}"
    
    ticket = {
        "id": ticket_id,
        "ticket_number": ticket_number,
        "user_id": current_user.id,
        "subject": subject,
        "message": message,
        "category": category,
        "priority": priority,
        "status": TicketStatus.OPEN,
        "project_id": project_id,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    notification = models.Notification(
        user_id=current_user.id,
        title="تم إنشاء تذكرة دعم جديدة",
        message=f"تم إنشاء تذكرة الدعم #{ticket_number} بنجاح. سيتم الرد عليك قريباً.",
        type="info",
        category="support",
        action_url=f"/support/tickets/{ticket_id}",
        action_text="عرض التذكرة"
    )
    
    db.add(notification)
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Support ticket created successfully",
        data={
            "ticket_id": ticket_id,
            "ticket_number": ticket_number,
            "status": TicketStatus.OPEN,
            "estimated_response_time": "24 hours"
        }
    )

@router.get("/tickets", response_model=schemas.APIResponse)
async def get_user_tickets(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    category: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    tickets = [
        {
            "id": "ticket-1",
            "ticket_number": "SNAP-1723069800",
            "subject": "مشكلة في تحميل القالب",
            "category": "technical",
            "priority": "medium",
            "status": "open",
            "created_at": "2024-08-07T20:30:00Z",
            "last_reply": "2024-08-07T21:00:00Z",
            "replies_count": 2
        },
        {
            "id": "ticket-2",
            "ticket_number": "SNAP-1723066200",
            "subject": "استفسار عن الاشتراك",
            "category": "billing",
            "priority": "low",
            "status": "resolved",
            "created_at": "2024-08-07T19:30:00Z",
            "last_reply": "2024-08-07T20:15:00Z",
            "replies_count": 4
        }
    ]
    
    filtered_tickets = tickets
    if status:
        filtered_tickets = [t for t in filtered_tickets if t["status"] == status]
    if category:
        filtered_tickets = [t for t in filtered_tickets if t["category"] == category]
    
    start = (page - 1) * limit
    end = start + limit
    paginated_tickets = filtered_tickets[start:end]
    
    return schemas.APIResponse(
        success=True,
        message="Support tickets retrieved successfully",
        data={
            "tickets": paginated_tickets,
            "total": len(filtered_tickets),
            "page": page,
            "limit": limit,
            "total_pages": (len(filtered_tickets) + limit - 1) // limit
        }
    )

@router.get("/tickets/{ticket_id}", response_model=schemas.APIResponse)
async def get_ticket_details(
    ticket_id: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    ticket = {
        "id": ticket_id,
        "ticket_number": "SNAP-1723069800",
        "subject": "مشكلة في تحميل القالب",
        "category": "technical",
        "priority": "medium",
        "status": "open",
        "project_id": 1,
        "created_at": "2024-08-07T20:30:00Z",
        "updated_at": "2024-08-07T21:00:00Z",
        "messages": [
            {
                "id": "msg-1",
                "sender": "user",
                "sender_name": current_user.full_name,
                "message": "أواجه مشكلة في تحميل القالب الجديد. يظهر خطأ عند محاولة التطبيق.",
                "created_at": "2024-08-07T20:30:00Z",
                "attachments": []
            },
            {
                "id": "msg-2",
                "sender": "support",
                "sender_name": "فريق الدعم",
                "message": "شكراً لتواصلك معنا. سنقوم بفحص المشكلة والرد عليك قريباً.",
                "created_at": "2024-08-07T20:45:00Z",
                "attachments": []
            },
            {
                "id": "msg-3",
                "sender": "support",
                "sender_name": "أحمد - فريق الدعم",
                "message": "تم حل المشكلة. يرجى المحاولة مرة أخرى وإعلامنا إذا استمرت المشكلة.",
                "created_at": "2024-08-07T21:00:00Z",
                "attachments": []
            }
        ]
    }
    
    return schemas.APIResponse(
        success=True,
        message="Ticket details retrieved successfully",
        data=ticket
    )

@router.post("/tickets/{ticket_id}/reply", response_model=schemas.APIResponse)
async def reply_to_ticket(
    ticket_id: str,
    reply_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    message = reply_data.get("message")
    
    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message is required"
        )
    
    reply_id = str(uuid.uuid4())
    
    reply = {
        "id": reply_id,
        "ticket_id": ticket_id,
        "sender": "user",
        "sender_name": current_user.full_name,
        "message": message,
        "created_at": datetime.utcnow().isoformat()
    }
    
    return schemas.APIResponse(
        success=True,
        message="Reply added successfully",
        data={
            "reply_id": reply_id,
            "ticket_id": ticket_id,
            "message": message
        }
    )

@router.put("/tickets/{ticket_id}/status", response_model=schemas.APIResponse)
async def update_ticket_status(
    ticket_id: str,
    status_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    new_status = status_data.get("status")
    
    if new_status not in [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )
    
    if current_user.role != models.UserRole.admin and new_status not in [TicketStatus.CLOSED]:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can change ticket status to this value"
        )
    
    return schemas.APIResponse(
        success=True,
        message="Ticket status updated successfully",
        data={
            "ticket_id": ticket_id,
            "new_status": new_status,
            "updated_at": datetime.utcnow().isoformat()
        }
    )

@router.get("/categories", response_model=schemas.APIResponse)
async def get_support_categories():
    categories = [
        {
            "id": "technical",
            "name_en": "Technical Support",
            "name_ar": "الدعم التقني",
            "description_ar": "مشاكل تقنية في الموقع أو الاستضافة"
        },
        {
            "id": "billing",
            "name_en": "Billing & Payments",
            "name_ar": "الفواتير والمدفوعات",
            "description_ar": "استفسارات حول الاشتراكات والمدفوعات"
        },
        {
            "id": "general",
            "name_en": "General Inquiry",
            "name_ar": "استفسار عام",
            "description_ar": "أسئلة عامة حول الخدمة"
        },
        {
            "id": "feature_request",
            "name_en": "Feature Request",
            "name_ar": "طلب ميزة جديدة",
            "description_ar": "اقتراح ميزات أو تحسينات جديدة"
        },
        {
            "id": "bug_report",
            "name_en": "Bug Report",
            "name_ar": "تقرير خطأ",
            "description_ar": "الإبلاغ عن أخطاء في النظام"
        }
    ]
    
    return schemas.APIResponse(
        success=True,
        message="Support categories retrieved successfully",
        data={"categories": categories}
    )

@router.get("/stats", response_model=schemas.APIResponse)
async def get_support_stats(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != models.UserRole.admin:
        stats = {
            "user_tickets": {
                "total": 5,
                "open": 1,
                "in_progress": 1,
                "resolved": 2,
                "closed": 1
            },
            "average_response_time": "4 hours",
            "satisfaction_rating": 4.5
        }
    else:
        stats = {
            "total_tickets": 156,
            "open_tickets": 23,
            "in_progress_tickets": 12,
            "resolved_today": 8,
            "average_response_time": "2.5 hours",
            "satisfaction_rating": 4.3,
            "categories_breakdown": {
                "technical": 45,
                "billing": 32,
                "general": 28,
                "feature_request": 15,
                "bug_report": 36
            },
            "priority_breakdown": {
                "urgent": 5,
                "high": 18,
                "medium": 89,
                "low": 44
            }
        }
    
    return schemas.APIResponse(
        success=True,
        message="Support statistics retrieved successfully",
        data=stats
    )

@router.post("/feedback", response_model=schemas.APIResponse)
async def submit_feedback(
    feedback_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    ticket_id = feedback_data.get("ticket_id")
    rating = feedback_data.get("rating")  # 1-5
    comment = feedback_data.get("comment", "")
    
    if not ticket_id or not rating:
        raise HTTPException(
            status_code=400,
            detail="Ticket ID and rating are required"
        )
    
    if rating < 1 or rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )
    
    feedback_id = str(uuid.uuid4())
    
    feedback = {
        "id": feedback_id,
        "ticket_id": ticket_id,
        "user_id": current_user.id,
        "rating": rating,
        "comment": comment,
        "created_at": datetime.utcnow().isoformat()
    }
    
    return schemas.APIResponse(
        success=True,
        message="Feedback submitted successfully",
        data={
            "feedback_id": feedback_id,
            "rating": rating,
            "thank_you_message": "شكراً لك على تقييمك! رأيك يساعدنا في تحسين خدماتنا."
        }
    )

@router.get("/knowledge-base", response_model=schemas.APIResponse)
async def get_knowledge_base(
    category: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 10
):
    articles = [
        {
            "id": "kb-1",
            "title": "كيفية إنشاء موقع جديد",
            "category": "getting_started",
            "summary": "دليل شامل لإنشاء موقع ووردبريس جديد باستخدام منصة SnapBrander",
            "content": "خطوات إنشاء موقع جديد...",
            "views": 1250,
            "helpful_votes": 45,
            "created_at": "2024-08-01T10:00:00Z",
            "updated_at": "2024-08-05T14:30:00Z"
        },
        {
            "id": "kb-2",
            "title": "حل مشاكل تحميل القوالب",
            "category": "troubleshooting",
            "summary": "الحلول الشائعة لمشاكل تحميل وتطبيق القوالب",
            "content": "إذا واجهت مشكلة في تحميل القالب...",
            "views": 890,
            "helpful_votes": 32,
            "created_at": "2024-07-28T09:15:00Z",
            "updated_at": "2024-08-03T11:20:00Z"
        },
        {
            "id": "kb-3",
            "title": "إعداد النطاق المخصص",
            "category": "domains",
            "summary": "كيفية ربط نطاقك المخصص بموقعك",
            "content": "لربط نطاق مخصص بموقعك...",
            "views": 650,
            "helpful_votes": 28,
            "created_at": "2024-07-25T16:45:00Z",
            "updated_at": "2024-08-01T13:10:00Z"
        }
    ]
    
    filtered_articles = articles
    if category:
        filtered_articles = [a for a in filtered_articles if a["category"] == category]
    if search:
        filtered_articles = [a for a in filtered_articles if search.lower() in a["title"].lower() or search.lower() in a["summary"].lower()]
    
    start = (page - 1) * limit
    end = start + limit
    paginated_articles = filtered_articles[start:end]
    
    return schemas.APIResponse(
        success=True,
        message="Knowledge base articles retrieved successfully",
        data={
            "articles": paginated_articles,
            "total": len(filtered_articles),
            "page": page,
            "limit": limit,
            "total_pages": (len(filtered_articles) + limit - 1) // limit,
            "categories": [
                {"id": "getting_started", "name": "البدء"},
                {"id": "troubleshooting", "name": "حل المشاكل"},
                {"id": "domains", "name": "النطاقات"},
                {"id": "templates", "name": "القوالب"},
                {"id": "billing", "name": "الفواتير"}
            ]
        }
    )
