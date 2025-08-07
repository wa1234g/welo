from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum, ForeignKey, JSON, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    admin = "admin"
    client = "client"

class UserStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    pending = "pending"

class ProjectStatus(str, enum.Enum):
    creating = "creating"
    active = "active"
    paused = "paused"
    error = "error"
    deleted = "deleted"
    maintenance = "maintenance"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20))
    avatar = Column(Text)
    role = Column(Enum(UserRole), default=UserRole.client)
    status = Column(Enum(UserStatus), default=UserStatus.active)
    email_verified_at = Column(DateTime)
    last_login_at = Column(DateTime)
    timezone = Column(String(50), default="Africa/Cairo")
    language = Column(String(5), default="ar")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    projects = relationship("Project", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True)
    subdomain = Column(String(255), unique=True)
    description = Column(Text)
    business_type = Column(String(100))
    template_id = Column(Integer)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.creating)
    wp_url = Column(String(255))
    wp_admin_username = Column(String(100))
    wp_admin_password = Column(String(255))
    database_name = Column(String(255))
    database_user = Column(String(255))
    database_password = Column(String(255))
    ftp_username = Column(String(255))
    ftp_password = Column(String(255))
    ssl_status = Column(String(20), default="pending")
    backup_enabled = Column(Boolean, default=True)
    monitoring_enabled = Column(Boolean, default=True)
    visitors_count = Column(Integer, default=0)
    last_backup_at = Column(DateTime)
    last_updated_at = Column(DateTime)
    expires_at = Column(DateTime)
    settings = Column(JSON)
    ai_generation_data = Column(JSON)
    seo_settings = Column(JSON)
    performance_score = Column(Integer, default=0)
    security_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="projects")

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(String(50), primary_key=True)
    name_en = Column(String(100), nullable=False)
    name_ar = Column(String(100), nullable=False)
    description_en = Column(Text)
    description_ar = Column(Text)
    monthly_price = Column(DECIMAL(10, 2), nullable=False)
    yearly_price = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(5), default="EGP")
    projects_limit = Column(Integer, default=-1)
    storage_limit_gb = Column(Integer, default=-1)
    bandwidth_limit_gb = Column(Integer, default=-1)
    templates_access = Column(String(20), default="basic")
    support_level = Column(String(20), default="email")
    custom_domain = Column(Boolean, default=False)
    ssl_certificate = Column(Boolean, default=True)
    backup_frequency = Column(String(20), default="weekly")
    ai_content_generation = Column(Boolean, default=False)
    seo_tools = Column(Boolean, default=False)
    analytics = Column(Boolean, default=False)
    features = Column(JSON)
    status = Column(String(20), default="active")
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")
    category = Column(String(50), default="general")
    priority = Column(String(20), default="medium")
    read_at = Column(DateTime)
    action_url = Column(String(500))
    action_text = Column(String(100))
    expires_at = Column(DateTime)
    meta_data = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    
    user = relationship("User", back_populates="notifications")

class Template(Base):
    __tablename__ = "templates"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    name_ar = Column(String(255))
    slug = Column(String(255), unique=True, nullable=False)
    category = Column(String(100))
    description = Column(Text)
    description_ar = Column(Text)
    preview_image = Column(String(500))
    gallery_images = Column(JSON)
    demo_url = Column(String(500))
    price = Column(DECIMAL(10, 2), default=0)
    is_premium = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    downloads_count = Column(Integer, default=0)
    rating = Column(DECIMAL(3, 2), default=0)
    ratings_count = Column(Integer, default=0)
    wordpress_theme_slug = Column(String(255))
    theme_version = Column(String(20))
    wordpress_min_version = Column(String(20), default="5.0")
    php_min_version = Column(String(20), default="7.4")
    required_plugins = Column(JSON)
    included_plugins = Column(JSON)
    customization_options = Column(JSON)
    compatible_business_types = Column(JSON)
    tags = Column(JSON)
    file_path = Column(String(500))
    file_size_mb = Column(DECIMAL(8, 2))
    last_updated_at = Column(DateTime)
    status = Column(String(20), default="active")
    created_by = Column(Integer)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(String(50), ForeignKey("subscription_plans.id"), nullable=False)
    status = Column(String(20), default="pending")
    billing_cycle = Column(String(20), default="monthly")
    amount = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(5), default="EGP")
    current_period_start = Column(DateTime, nullable=False)
    current_period_end = Column(DateTime, nullable=False)
    auto_renew = Column(Boolean, default=True)
    paymob_subscription_id = Column(String(100))
    trial_ends_at = Column(DateTime)
    cancelled_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subscription_id = Column(String(50), ForeignKey("subscriptions.id"))
    amount = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(5), default="EGP")
    status = Column(String(20), default="pending")
    payment_method = Column(String(50))
    paymob_transaction_id = Column(String(100))
    paymob_order_id = Column(String(100))
    gateway_response = Column(JSON)
    invoice_url = Column(String(500))
    refund_amount = Column(DECIMAL(10, 2), default=0)
    refunded_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="payments")
    subscription = relationship("Subscription")
