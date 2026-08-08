"""SQLAlchemy ORM models — infrastructure layer only."""
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, String, Text, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.infrastructure.database.connection import Base


class BrandModel(Base):
    __tablename__ = "brands"

    id              = Column(String, primary_key=True)
    name            = Column(String(200), nullable=False)
    floor           = Column(String(50), nullable=False, default="Level 1")
    type            = Column(String(100), nullable=False, default="Fashion")
    description     = Column(Text, default="")
    featured        = Column(Boolean, default=False)
    logo_url        = Column(String(1000), nullable=True)
    cover_image_url = Column(String(1000), nullable=True)
    priority        = Column(Integer, default=0, nullable=False)
    is_active       = Column(Boolean, default=True, nullable=False)
    website_url     = Column(String(1000), nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship(
        "ProductModel",
        back_populates="brand",
        cascade="all, delete-orphan",
        order_by="ProductModel.name",
    )
    offers = relationship(
        "OfferModel",
        back_populates="brand",
        cascade="all, delete-orphan",
    )


class ProductModel(Base):
    __tablename__ = "products"

    id         = Column(String, primary_key=True)
    brand_id   = Column(String, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    name       = Column(String(300), nullable=False)
    price      = Column(String(50), nullable=False)
    rating     = Column(Float, default=5.0)
    category   = Column(String(100), nullable=False)
    image      = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    brand = relationship("BrandModel", back_populates="products")
    flash_sales = relationship("FlashSaleModel", back_populates="product", cascade="all, delete-orphan")


class CategoryModel(Base):
    __tablename__ = "categories"

    id            = Column(String, primary_key=True)
    name          = Column(String(100), nullable=False)
    icon          = Column(String(10), default="🏷️")
    count         = Column(Integer, default=0)
    display_order = Column(Integer, default=0, nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())


class LeasingInquiryModel(Base):
    __tablename__ = "leasing_inquiries"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name    = Column(String(200), nullable=False)
    company_name = Column(String(200), nullable=False)
    email        = Column(String(254), nullable=False)
    category     = Column(String(100), nullable=False)
    message      = Column(Text, default="")
    created_at   = Column(DateTime(timezone=True), server_default=func.now())


class LoyaltyMemberModel(Base):
    __tablename__ = "loyalty_members"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email      = Column(String(254), unique=True, nullable=False)
    name       = Column(String(200), nullable=False)
    tier       = Column(String(50), default="Silver")
    points     = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AdminUserModel(Base):
    """Admin accounts that can sign in to the management portal.

    Stored in the DB (not just .env) so login never breaks if the env file
    fails to load. Passwords are kept as bcrypt hashes, never plaintext.
    """
    __tablename__ = "admin_users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email         = Column(String(254), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role          = Column(String(50), default="admin", nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())


class PromotionalCampaignModel(Base):
    __tablename__ = "promotional_campaigns"

    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name                 = Column(String(200), nullable=False)
    subtitle             = Column(String(300), nullable=True)
    description          = Column(Text, nullable=True)
    campaign_type        = Column(String(100), default="general", nullable=False)
    start_date           = Column(DateTime(timezone=True), nullable=False)
    end_date             = Column(DateTime(timezone=True), nullable=False)
    is_active            = Column(Boolean, default=True, nullable=False)
    background_image_url = Column(String(1000), nullable=True)
    created_at           = Column(DateTime(timezone=True), server_default=func.now())


class HeroBannerModel(Base):
    __tablename__ = "hero_banners"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    banner_type      = Column(String(50), default="hero", nullable=False) # hero, middle, footer, sidebar
    image_url        = Column(String(1000), nullable=False)
    mobile_image_url = Column(String(1000), nullable=True)
    cta_text         = Column(String(100), nullable=True)
    redirect_url     = Column(String(1000), nullable=True)
    display_order    = Column(Integer, default=0, nullable=False)
    start_date       = Column(DateTime(timezone=True), nullable=True)
    end_date         = Column(DateTime(timezone=True), nullable=True)
    is_active        = Column(Boolean, default=True, nullable=False)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())


class OfferModel(Base):
    __tablename__ = "offers"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    brand_id            = Column(String, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    title               = Column(String(200), nullable=False)
    subtitle            = Column(String(300), nullable=True)
    description         = Column(Text, nullable=True)
    discount_percentage = Column(Integer, nullable=True)
    flat_discount       = Column(Float, nullable=True)
    coupon_code         = Column(String(50), nullable=True)
    start_date          = Column(DateTime(timezone=True), nullable=False)
    end_date            = Column(DateTime(timezone=True), nullable=False)
    is_active           = Column(Boolean, default=True, nullable=False)
    background_color    = Column(String(50), default="#14122E", nullable=False)
    text_color          = Column(String(50), default="#F0EEF8", nullable=False)
    display_priority    = Column(Integer, default=0, nullable=False)
    tags                = Column(Text, nullable=True) # Comma-separated or JSON list string
    banner_url          = Column(String(1000), nullable=True)
    mobile_banner_url   = Column(String(1000), nullable=True)
    desktop_banner_url  = Column(String(1000), nullable=True)
    is_featured         = Column(Boolean, default=False, nullable=False)
    is_trending         = Column(Boolean, default=False, nullable=False)
    views_count         = Column(Integer, default=0, nullable=False)
    clicks_count        = Column(Integer, default=0, nullable=False)
    created_at          = Column(DateTime(timezone=True), server_default=func.now())

    brand = relationship("BrandModel", back_populates="offers")


class CouponModel(Base):
    __tablename__ = "coupons"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code           = Column(String(50), unique=True, nullable=False)
    description    = Column(Text, nullable=True)
    discount_value = Column(Float, nullable=False)
    discount_type  = Column(String(50), default="percentage", nullable=False) # percentage, flat
    start_date     = Column(DateTime(timezone=True), nullable=False)
    end_date       = Column(DateTime(timezone=True), nullable=False)
    is_active      = Column(Boolean, default=True, nullable=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())


class FlashSaleModel(Base):
    __tablename__ = "flash_sales"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id     = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    discount_price = Column(String(50), nullable=False)
    start_date     = Column(DateTime(timezone=True), nullable=False)
    end_date       = Column(DateTime(timezone=True), nullable=False)
    is_active      = Column(Boolean, default=True, nullable=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("ProductModel", back_populates="flash_sales")


class MediaLibraryModel(Base):
    __tablename__ = "media_library"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename   = Column(String(255), nullable=False)
    url        = Column(String(1000), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
