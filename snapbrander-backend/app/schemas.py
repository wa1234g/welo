from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    client = "client"

class UserStatus(str, Enum):
    active = "active"
    suspended = "suspended"
    pending = "pending"

class ProjectStatus(str, Enum):
    creating = "creating"
    active = "active"
    paused = "paused"
    error = "error"
    deleted = "deleted"
    maintenance = "maintenance"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.client
    timezone: str = "Africa/Cairo"
    language: str = "ar"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None

class UserResponse(UserBase):
    id: int
    avatar: Optional[str] = None
    status: UserStatus
    email_verified_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ClientSiteCreate(BaseModel):
    project_id: int
    subdomain: Optional[str] = None
    wp_admin_username: Optional[str] = "admin"
    wp_admin_password: str
    wp_admin_email: Optional[str] = None
    site_title: Optional[str] = None
    template_id: Optional[int] = None

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    business_type: Optional[str] = None
    template_id: Optional[int] = None

class ProjectCreate(ProjectBase):
    domain: Optional[str] = None
    subdomain: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    ai_generation_data: Optional[Dict[str, Any]] = None
    seo_settings: Optional[Dict[str, Any]] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    business_type: Optional[str] = None
    domain: Optional[str] = None
    subdomain: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    ai_generation_data: Optional[Dict[str, Any]] = None
    seo_settings: Optional[Dict[str, Any]] = None

class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    domain: Optional[str] = None
    subdomain: Optional[str] = None
    status: ProjectStatus
    wp_url: Optional[str] = None
    visitors_count: int = 0
    performance_score: int = 0
    security_score: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TemplateBase(BaseModel):
    name: str
    name_ar: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None

class TemplateResponse(TemplateBase):
    id: int
    slug: str
    preview_image: Optional[str] = None
    demo_url: Optional[str] = None
    price: float = 0
    is_premium: bool = False
    is_featured: bool = False
    downloads_count: int = 0
    rating: float = 0
    ratings_count: int = 0
    status: str = "active"
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str = "info"
    category: str = "general"
    priority: str = "medium"
    read_at: Optional[datetime] = None
    action_url: Optional[str] = None
    action_text: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SubscriptionPlanResponse(BaseModel):
    id: str
    name_en: str
    name_ar: str
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    monthly_price: float
    yearly_price: float
    currency: str = "EGP"
    projects_limit: int = -1
    storage_limit_gb: int = -1
    features: Optional[Dict[str, Any]] = None
    status: str = "active"

    class Config:
        from_attributes = True

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[List[str]] = None

class PaginationResponse(BaseModel):
    page: int
    limit: int
    total: int
    pages: int
