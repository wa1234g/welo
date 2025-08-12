from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from datetime import datetime, timedelta
import uuid
import re

router = APIRouter(prefix="/api/domains", tags=["domains"])

class DomainStatus:
    PENDING = "pending"
    ACTIVE = "active"
    EXPIRED = "expired"
    SUSPENDED = "suspended"
    TRANSFERRED = "transferred"

@router.get("/available", response_model=schemas.APIResponse)
async def check_domain_availability(
    domain: str,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    domain_pattern = r'^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$'
    if not re.match(domain_pattern, domain):
        raise HTTPException(
            status_code=400,
            detail="Invalid domain format"
        )
    
    unavailable_domains = [
        "google.com", "facebook.com", "youtube.com", "amazon.com",
        "snapbrander.com", "example.com", "test.com"
    ]
    
    is_available = domain.lower() not in unavailable_domains
    
    suggestions = []
    if not is_available:
        base_domain = domain.split('.')[0]
        extensions = ['.net', '.org', '.co', '.io', '.me', '.tech']
        for ext in extensions:
            suggestions.append(f"{base_domain}{ext}")
    
    return schemas.APIResponse(
        success=True,
        message="Domain availability checked successfully",
        data={
            "domain": domain,
            "available": is_available,
            "price": 120.00 if is_available else None,
            "currency": "EGP",
            "suggestions": suggestions[:5] if suggestions else []
        }
    )

@router.post("/register", response_model=schemas.APIResponse)
async def register_domain(
    domain_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    domain_name = domain_data.get("domain")
    project_id = domain_data.get("project_id")
    registrant_info = domain_data.get("registrant_info", {})
    
    if not domain_name or not project_id:
        raise HTTPException(
            status_code=400,
            detail="Domain name and project ID are required"
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
    
    domain_id = str(uuid.uuid4())
    registration_id = f"REG-{int(datetime.now().timestamp())}"
    
    domain_record = {
        "id": domain_id,
        "domain_name": domain_name,
        "project_id": project_id,
        "user_id": current_user.id,
        "status": DomainStatus.PENDING,
        "registration_id": registration_id,
        "registered_at": datetime.utcnow().isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(days=365)).isoformat(),
        "auto_renew": domain_data.get("auto_renew", True),
        "nameservers": [
            "ns1.snapbrander.com",
            "ns2.snapbrander.com"
        ],
        "registrant_info": registrant_info
    }
    
    notification = models.Notification(
        user_id=current_user.id,
        title="تم تسجيل النطاق بنجاح",
        message=f"تم تسجيل النطاق {domain_name} بنجاح. سيتم تفعيله خلال 24 ساعة.",
        type="success",
        category="domains",
        action_url=f"/domains/{domain_id}",
        action_text="عرض النطاق"
    )
    
    db.add(notification)
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Domain registration initiated successfully",
        data={
            "domain_id": domain_id,
            "registration_id": registration_id,
            "domain_name": domain_name,
            "status": DomainStatus.PENDING,
            "estimated_activation": "24 hours"
        }
    )

@router.get("/", response_model=schemas.APIResponse)
async def get_user_domains(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    domains = [
        {
            "id": "domain-1",
            "domain_name": "mycompany.com",
            "project_id": 1,
            "project_name": "موقع الشركة",
            "status": "active",
            "registered_at": "2024-01-15T10:00:00Z",
            "expires_at": "2025-01-15T10:00:00Z",
            "auto_renew": True,
            "ssl_enabled": True,
            "dns_managed": True
        },
        {
            "id": "domain-2",
            "domain_name": "myblog.net",
            "project_id": 2,
            "project_name": "مدونة شخصية",
            "status": "active",
            "registered_at": "2024-03-20T14:30:00Z",
            "expires_at": "2025-03-20T14:30:00Z",
            "auto_renew": False,
            "ssl_enabled": True,
            "dns_managed": True
        }
    ]
    
    if status:
        domains = [d for d in domains if d["status"] == status]
    
    start = (page - 1) * limit
    end = start + limit
    paginated_domains = domains[start:end]
    
    return schemas.APIResponse(
        success=True,
        message="User domains retrieved successfully",
        data={
            "domains": paginated_domains,
            "total": len(domains),
            "page": page,
            "limit": limit,
            "total_pages": (len(domains) + limit - 1) // limit
        }
    )

@router.get("/{domain_id}", response_model=schemas.APIResponse)
async def get_domain_details(
    domain_id: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    domain = {
        "id": domain_id,
        "domain_name": "mycompany.com",
        "project_id": 1,
        "project_name": "موقع الشركة",
        "status": "active",
        "registration_id": "REG-1705312800",
        "registered_at": "2024-01-15T10:00:00Z",
        "expires_at": "2025-01-15T10:00:00Z",
        "auto_renew": True,
        "nameservers": [
            "ns1.snapbrander.com",
            "ns2.snapbrander.com"
        ],
        "dns_records": [
            {"type": "A", "name": "@", "value": "192.168.1.100", "ttl": 3600},
            {"type": "CNAME", "name": "www", "value": "mycompany.com", "ttl": 3600},
            {"type": "MX", "name": "@", "value": "mail.mycompany.com", "priority": 10, "ttl": 3600}
        ],
        "ssl_certificate": {
            "enabled": True,
            "issuer": "Let's Encrypt",
            "expires_at": "2024-11-15T10:00:00Z",
            "auto_renew": True
        },
        "registrant_info": {
            "name": current_user.full_name,
            "email": current_user.email,
            "phone": "+20123456789",
            "organization": "شركة التقنية المتقدمة"
        }
    }
    
    return schemas.APIResponse(
        success=True,
        message="Domain details retrieved successfully",
        data=domain
    )

@router.put("/{domain_id}/nameservers", response_model=schemas.APIResponse)
async def update_nameservers(
    domain_id: str,
    nameserver_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    nameservers = nameserver_data.get("nameservers", [])
    
    if not nameservers or len(nameservers) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 nameservers are required"
        )
    
    for ns in nameservers:
        if not re.match(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', ns):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid nameserver format: {ns}"
            )
    
    return schemas.APIResponse(
        success=True,
        message="Nameservers updated successfully",
        data={
            "domain_id": domain_id,
            "nameservers": nameservers,
            "updated_at": datetime.utcnow().isoformat(),
            "propagation_time": "24-48 hours"
        }
    )

@router.post("/{domain_id}/dns", response_model=schemas.APIResponse)
async def add_dns_record(
    domain_id: str,
    dns_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    record_type = dns_data.get("type")
    name = dns_data.get("name")
    value = dns_data.get("value")
    ttl = dns_data.get("ttl", 3600)
    priority = dns_data.get("priority")
    
    if not record_type or not name or not value:
        raise HTTPException(
            status_code=400,
            detail="Record type, name, and value are required"
        )
    
    valid_types = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"]
    if record_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid record type. Must be one of: {', '.join(valid_types)}"
        )
    
    record_id = str(uuid.uuid4())
    
    dns_record = {
        "id": record_id,
        "domain_id": domain_id,
        "type": record_type,
        "name": name,
        "value": value,
        "ttl": ttl,
        "priority": priority,
        "created_at": datetime.utcnow().isoformat()
    }
    
    return schemas.APIResponse(
        success=True,
        message="DNS record added successfully",
        data={
            "record_id": record_id,
            "record": dns_record,
            "propagation_time": "5-10 minutes"
        }
    )

@router.delete("/{domain_id}/dns/{record_id}", response_model=schemas.APIResponse)
async def delete_dns_record(
    domain_id: str,
    record_id: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return schemas.APIResponse(
        success=True,
        message="DNS record deleted successfully",
        data={
            "domain_id": domain_id,
            "record_id": record_id,
            "deleted_at": datetime.utcnow().isoformat()
        }
    )

@router.post("/{domain_id}/ssl", response_model=schemas.APIResponse)
async def enable_ssl_certificate(
    domain_id: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return schemas.APIResponse(
        success=True,
        message="SSL certificate enabled successfully",
        data={
            "domain_id": domain_id,
            "ssl_enabled": True,
            "certificate_issuer": "Let's Encrypt",
            "expires_at": (datetime.utcnow() + timedelta(days=90)).isoformat(),
            "auto_renew": True
        }
    )

@router.put("/{domain_id}/auto-renew", response_model=schemas.APIResponse)
async def toggle_auto_renew(
    domain_id: str,
    auto_renew_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auto_renew = auto_renew_data.get("auto_renew", True)
    
    return schemas.APIResponse(
        success=True,
        message="Auto-renewal setting updated successfully",
        data={
            "domain_id": domain_id,
            "auto_renew": auto_renew,
            "updated_at": datetime.utcnow().isoformat()
        }
    )

@router.post("/{domain_id}/transfer", response_model=schemas.APIResponse)
async def initiate_domain_transfer(
    domain_id: str,
    transfer_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    auth_code = transfer_data.get("auth_code")
    new_registrar = transfer_data.get("new_registrar")
    
    if not auth_code or not new_registrar:
        raise HTTPException(
            status_code=400,
            detail="Authorization code and new registrar are required"
        )
    
    transfer_id = str(uuid.uuid4())
    
    return schemas.APIResponse(
        success=True,
        message="Domain transfer initiated successfully",
        data={
            "transfer_id": transfer_id,
            "domain_id": domain_id,
            "new_registrar": new_registrar,
            "status": "pending",
            "estimated_completion": "5-7 days"
        }
    )

@router.get("/pricing/tlds", response_model=schemas.APIResponse)
async def get_domain_pricing():
    pricing = [
        {"tld": ".com", "registration": 120.00, "renewal": 120.00, "transfer": 120.00},
        {"tld": ".net", "registration": 140.00, "renewal": 140.00, "transfer": 140.00},
        {"tld": ".org", "registration": 130.00, "renewal": 130.00, "transfer": 130.00},
        {"tld": ".co", "registration": 350.00, "renewal": 350.00, "transfer": 350.00},
        {"tld": ".io", "registration": 650.00, "renewal": 650.00, "transfer": 650.00},
        {"tld": ".me", "registration": 280.00, "renewal": 280.00, "transfer": 280.00},
        {"tld": ".tech", "registration": 450.00, "renewal": 450.00, "transfer": 450.00}
    ]
    
    return schemas.APIResponse(
        success=True,
        message="Domain pricing retrieved successfully",
        data={
            "currency": "EGP",
            "pricing": pricing,
            "bulk_discounts": {
                "5_domains": 5,
                "10_domains": 10,
                "20_domains": 15
            }
        }
    )
