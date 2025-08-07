from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.post("/create-order", response_model=schemas.APIResponse)
async def create_payment_order(
    payment_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    subscription_id = payment_data.get("subscription_id")
    amount = payment_data.get("amount")
    currency = payment_data.get("currency", "EGP")
    
    if not subscription_id or not amount:
        raise HTTPException(
            status_code=400,
            detail="Subscription ID and amount are required"
        )
    
    subscription = db.query(models.Subscription).filter(
        models.Subscription.id == subscription_id,
        models.Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )
    
    payment_id = str(uuid.uuid4())
    paymob_order_id = f"order_{int(datetime.now().timestamp())}_{current_user.id}"
    
    new_payment = models.Payment(
        id=payment_id,
        user_id=current_user.id,
        subscription_id=subscription_id,
        amount=amount,
        currency=currency,
        status="pending",
        paymob_order_id=paymob_order_id
    )
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    
    paymob_data = {
        "order_id": paymob_order_id,
        "amount": float(amount) * 100,
        "currency": currency,
        "items": [
            {
                "name": f"Subscription - {subscription.plan_id}",
                "amount": float(amount) * 100,
                "description": f"SnapBrander {subscription.plan_id} plan subscription",
                "quantity": 1
            }
        ]
    }
    
    payment_url = f"https://accept.paymob.com/api/acceptance/iframes/YOUR_IFRAME_ID?payment_token=PAYMENT_TOKEN"
    
    return schemas.APIResponse(
        success=True,
        message="Payment order created successfully",
        data={
            "payment_id": payment_id,
            "paymob_order_id": paymob_order_id,
            "payment_url": payment_url,
            "amount": amount,
            "currency": currency
        }
    )

@router.post("/webhook", response_model=schemas.APIResponse)
async def paymob_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        webhook_data = await request.json()
        
        transaction_id = webhook_data.get("id")
        order_id = webhook_data.get("order", {}).get("id")
        success = webhook_data.get("success", False)
        amount_cents = webhook_data.get("amount_cents", 0)
        
        payment = db.query(models.Payment).filter(
            models.Payment.paymob_order_id == str(order_id)
        ).first()
        
        if not payment:
            return schemas.APIResponse(
                success=False,
                message="Payment not found"
            )
        
        payment.paymob_transaction_id = str(transaction_id)
        payment.gateway_response = webhook_data
        
        if success:
            payment.status = "completed"
            
            subscription = db.query(models.Subscription).filter(
                models.Subscription.id == payment.subscription_id
            ).first()
            
            if subscription:
                subscription.status = "active"
                db.commit()
        else:
            payment.status = "failed"
            db.commit()
        
        return schemas.APIResponse(
            success=True,
            message="Webhook processed successfully"
        )
        
    except Exception as e:
        return schemas.APIResponse(
            success=False,
            message=f"Webhook processing failed: {str(e)}"
        )

@router.get("/history", response_model=schemas.APIResponse)
async def get_payment_history(
    page: int = 1,
    limit: int = 10,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Payment).filter(
        models.Payment.user_id == current_user.id
    ).order_by(models.Payment.created_at.desc())
    
    total = query.count()
    payments = query.offset((page - 1) * limit).limit(limit).all()
    
    payments_data = []
    for payment in payments:
        payment_dict = {
            "id": payment.id,
            "subscription_id": payment.subscription_id,
            "amount": float(payment.amount),
            "currency": payment.currency,
            "status": payment.status,
            "payment_method": payment.payment_method,
            "created_at": payment.created_at,
            "invoice_url": payment.invoice_url
        }
        payments_data.append(payment_dict)
    
    return schemas.APIResponse(
        success=True,
        message="Payment history retrieved successfully",
        data={
            "payments": payments_data,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    )

@router.get("/{payment_id}", response_model=schemas.APIResponse)
async def get_payment_details(
    payment_id: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )
    
    payment_data = {
        "id": payment.id,
        "subscription_id": payment.subscription_id,
        "amount": float(payment.amount),
        "currency": payment.currency,
        "status": payment.status,
        "payment_method": payment.payment_method,
        "paymob_transaction_id": payment.paymob_transaction_id,
        "paymob_order_id": payment.paymob_order_id,
        "invoice_url": payment.invoice_url,
        "refund_amount": float(payment.refund_amount) if payment.refund_amount else 0,
        "refunded_at": payment.refunded_at,
        "created_at": payment.created_at,
        "updated_at": payment.updated_at
    }
    
    return schemas.APIResponse(
        success=True,
        message="Payment details retrieved successfully",
        data=payment_data
    )

@router.post("/{payment_id}/refund", response_model=schemas.APIResponse)
async def request_refund(
    payment_id: str,
    refund_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    payment = db.query(models.Payment).filter(
        models.Payment.id == payment_id,
        models.Payment.user_id == current_user.id,
        models.Payment.status == "completed"
    ).first()
    
    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found or not eligible for refund"
        )
    
    refund_amount = refund_data.get("amount", payment.amount)
    reason = refund_data.get("reason", "User requested refund")
    
    if refund_amount > payment.amount:
        raise HTTPException(
            status_code=400,
            detail="Refund amount cannot exceed payment amount"
        )
    
    payment.refund_amount = refund_amount
    payment.refunded_at = datetime.utcnow()
    payment.status = "refunded"
    
    if payment.subscription_id:
        subscription = db.query(models.Subscription).filter(
            models.Subscription.id == payment.subscription_id
        ).first()
        if subscription:
            subscription.status = "cancelled"
    
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Refund processed successfully",
        data={
            "payment_id": payment_id,
            "refund_amount": float(refund_amount),
            "refunded_at": payment.refunded_at
        }
    )

@router.get("/methods/available", response_model=schemas.APIResponse)
async def get_available_payment_methods():
    methods = [
        {
            "id": "card",
            "name_en": "Credit/Debit Card",
            "name_ar": "بطاقة ائتمان/خصم",
            "icon": "credit-card",
            "enabled": True
        },
        {
            "id": "wallet",
            "name_en": "Mobile Wallet",
            "name_ar": "محفظة موبايل",
            "icon": "mobile",
            "enabled": True
        },
        {
            "id": "bank_transfer",
            "name_en": "Bank Transfer",
            "name_ar": "تحويل بنكي",
            "icon": "bank",
            "enabled": True
        },
        {
            "id": "installments",
            "name_en": "Installments",
            "name_ar": "أقساط",
            "icon": "calendar",
            "enabled": True
        }
    ]
    
    return schemas.APIResponse(
        success=True,
        message="Available payment methods retrieved successfully",
        data={"methods": methods}
    )
