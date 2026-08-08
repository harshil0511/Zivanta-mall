from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class PromotionalCampaignBase(BaseModel):
    name: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    campaign_type: str = "general"
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    background_image_url: Optional[str] = None


class PromotionalCampaignCreate(PromotionalCampaignBase):
    pass


class PromotionalCampaignResponse(PromotionalCampaignBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class HeroBannerBase(BaseModel):
    banner_type: str = "hero"
    image_url: str
    mobile_image_url: Optional[str] = None
    cta_text: Optional[str] = None
    redirect_url: Optional[str] = None
    display_order: int = 0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True


class HeroBannerCreate(HeroBannerBase):
    pass


class HeroBannerResponse(HeroBannerBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class OfferBase(BaseModel):
    brand_id: str
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    discount_percentage: Optional[int] = None
    flat_discount: Optional[float] = None
    coupon_code: Optional[str] = None
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    background_color: str = "#14122E"
    text_color: str = "#F0EEF8"
    display_priority: int = 0
    tags: Optional[str] = None
    banner_url: Optional[str] = None
    mobile_banner_url: Optional[str] = None
    desktop_banner_url: Optional[str] = None
    is_featured: bool = False
    is_trending: bool = False


class OfferCreate(OfferBase):
    pass


class OfferResponse(OfferBase):
    id: UUID
    views_count: int
    clicks_count: int
    created_at: datetime
    brand_name: Optional[str] = None

    class Config:
        from_attributes = True


class CouponBase(BaseModel):
    code: str
    description: Optional[str] = None
    discount_value: float
    discount_type: str = "percentage"
    start_date: datetime
    end_date: datetime
    is_active: bool = True


class CouponCreate(CouponBase):
    pass


class CouponResponse(CouponBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class FlashSaleBase(BaseModel):
    product_id: str
    discount_price: str
    start_date: datetime
    end_date: datetime
    is_active: bool = True


class FlashSaleCreate(FlashSaleBase):
    pass


class FlashSaleResponse(FlashSaleBase):
    id: UUID
    created_at: datetime
    product_name: Optional[str] = None
    product_price: Optional[str] = None
    product_image: Optional[str] = None
    brand_name: Optional[str] = None

    class Config:
        from_attributes = True


class MediaLibraryResponse(BaseModel):
    id: UUID
    filename: str
    url: str
    created_at: datetime

    class Config:
        from_attributes = True
