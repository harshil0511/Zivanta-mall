from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.infrastructure.database.connection import get_db
from src.api.dependencies import require_admin
from src.infrastructure.database.models import (
    OfferModel, PromotionalCampaignModel, HeroBannerModel,
    CouponModel, FlashSaleModel, MediaLibraryModel, BrandModel, ProductModel
)
from src.application.dtos.promotion_dto import (
    OfferCreate, OfferResponse, PromotionalCampaignCreate, PromotionalCampaignResponse,
    HeroBannerCreate, HeroBannerResponse, CouponCreate, CouponResponse,
    FlashSaleCreate, FlashSaleResponse, MediaLibraryResponse
)

router = APIRouter(prefix="/api", tags=["Promotions"])


# ── OFFERS ENDPOINTS ──────────────────────────────────────────────────────────

@router.get("/offers", response_model=List[OfferResponse])
def list_offers(
    brand_id: Optional[str] = None,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    is_active: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    is_trending: Optional[bool] = None,
    sort_by: str = "priority",  # priority, latest, oldest, discount, views, clicks
    db: Session = Depends(get_db)
):
    query = db.query(OfferModel)

    # Filtering
    if brand_id:
        query = query.filter(OfferModel.brand_id == brand_id)
    if category:
        query = query.join(BrandModel).filter(BrandModel.type.ilike(category))
    if is_active is not None:
        query = query.filter(OfferModel.is_active == is_active)
    if is_featured is not None:
        query = query.filter(OfferModel.is_featured == is_featured)
    if is_trending is not None:
        query = query.filter(OfferModel.is_trending == is_trending)
    if tag:
        query = query.filter(OfferModel.tags.ilike(f"%{tag}%"))

    # Sorting
    if sort_by == "priority":
        query = query.order_by(OfferModel.display_priority.desc(), OfferModel.created_at.desc())
    elif sort_by == "latest":
        query = query.order_by(OfferModel.created_at.desc())
    elif sort_by == "oldest":
        query = query.order_by(OfferModel.created_at.asc())
    elif sort_by == "discount":
        query = query.order_by(OfferModel.discount_percentage.desc())
    elif sort_by == "views":
        query = query.order_by(OfferModel.views_count.desc())
    elif sort_by == "clicks":
        query = query.order_by(OfferModel.clicks_count.desc())

    offers = query.all()

    # Add brand name dynamically
    for o in offers:
        brand = db.get(BrandModel, o.brand_id)
        o.brand_name = brand.name if brand else "Unknown"

    return offers


@router.get("/offers/{offer_id}", response_model=OfferResponse)
def get_offer(offer_id: UUID, db: Session = Depends(get_db)):
    offer = db.get(OfferModel, offer_id)
    if not offer:
        raise HTTPException(404, "Offer not found")
    brand = db.get(BrandModel, offer.brand_id)
    offer.brand_name = brand.name if brand else "Unknown"
    return offer


@router.post("/offers", response_model=OfferResponse, status_code=201, dependencies=[Depends(require_admin)])
def create_offer(dto: OfferCreate, db: Session = Depends(get_db)):
    # Check brand exists
    brand = db.get(BrandModel, dto.brand_id)
    if not brand:
        raise HTTPException(400, "Invalid Brand ID")

    offer = OfferModel(
        brand_id=dto.brand_id,
        title=dto.title,
        subtitle=dto.subtitle,
        description=dto.description,
        discount_percentage=dto.discount_percentage,
        flat_discount=dto.flat_discount,
        coupon_code=dto.coupon_code,
        start_date=dto.start_date,
        end_date=dto.end_date,
        is_active=dto.is_active,
        background_color=dto.background_color,
        text_color=dto.text_color,
        display_priority=dto.display_priority,
        tags=dto.tags,
        banner_url=dto.banner_url,
        mobile_banner_url=dto.mobile_banner_url,
        desktop_banner_url=dto.desktop_banner_url,
        is_featured=dto.is_featured,
        is_trending=dto.is_trending
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)
    offer.brand_name = brand.name
    return offer


@router.put("/offers/{offer_id}", response_model=OfferResponse, dependencies=[Depends(require_admin)])
def update_offer(offer_id: UUID, dto: OfferCreate, db: Session = Depends(get_db)):
    offer = db.get(OfferModel, offer_id)
    if not offer:
        raise HTTPException(404, "Offer not found")

    brand = db.get(BrandModel, dto.brand_id)
    if not brand:
        raise HTTPException(400, "Invalid Brand ID")

    for field, value in dto.model_dump().items():
        setattr(offer, field, value)

    db.commit()
    db.refresh(offer)
    offer.brand_name = brand.name
    return offer


@router.delete("/offers/{offer_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_offer(offer_id: UUID, db: Session = Depends(get_db)):
    offer = db.get(OfferModel, offer_id)
    if not offer:
        raise HTTPException(404, "Offer not found")
    db.delete(offer)
    db.commit()


@router.post("/offers/{offer_id}/view")
def increment_offer_view(offer_id: UUID, db: Session = Depends(get_db)):
    offer = db.get(OfferModel, offer_id)
    if not offer:
        raise HTTPException(404, "Offer not found")
    offer.views_count += 1
    db.commit()
    return {"status": "ok", "views": offer.views_count}


@router.post("/offers/{offer_id}/click")
def increment_offer_click(offer_id: UUID, db: Session = Depends(get_db)):
    offer = db.get(OfferModel, offer_id)
    if not offer:
        raise HTTPException(404, "Offer not found")
    offer.clicks_count += 1
    db.commit()
    return {"status": "ok", "clicks": offer.clicks_count}


# ── CAMPAIGNS ENDPOINTS ───────────────────────────────────────────────────────

@router.get("/campaigns", response_model=List[PromotionalCampaignResponse])
def list_campaigns(active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(PromotionalCampaignModel)
    if active_only:
        now = datetime.utcnow()
        query = query.filter(
            PromotionalCampaignModel.is_active == True,
            PromotionalCampaignModel.start_date <= now,
            PromotionalCampaignModel.end_date >= now
        )
    return query.order_by(PromotionalCampaignModel.start_date.desc()).all()


@router.get("/campaigns/{campaign_id}", response_model=PromotionalCampaignResponse)
def get_campaign(campaign_id: UUID, db: Session = Depends(get_db)):
    campaign = db.get(PromotionalCampaignModel, campaign_id)
    if not campaign:
        raise HTTPException(404, "Campaign not found")
    return campaign


@router.post("/campaigns", response_model=PromotionalCampaignResponse, status_code=201, dependencies=[Depends(require_admin)])
def create_campaign(dto: PromotionalCampaignCreate, db: Session = Depends(get_db)):
    campaign = PromotionalCampaignModel(**dto.model_dump())
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


@router.put("/campaigns/{campaign_id}", response_model=PromotionalCampaignResponse, dependencies=[Depends(require_admin)])
def update_campaign(campaign_id: UUID, dto: PromotionalCampaignCreate, db: Session = Depends(get_db)):
    campaign = db.get(PromotionalCampaignModel, campaign_id)
    if not campaign:
        raise HTTPException(404, "Campaign not found")
    for field, value in dto.model_dump().items():
        setattr(campaign, field, value)
    db.commit()
    db.refresh(campaign)
    return campaign


@router.delete("/campaigns/{campaign_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_campaign(campaign_id: UUID, db: Session = Depends(get_db)):
    campaign = db.get(PromotionalCampaignModel, campaign_id)
    if not campaign:
        raise HTTPException(404, "Campaign not found")
    db.delete(campaign)
    db.commit()


# ── HERO BANNERS ENDPOINTS ────────────────────────────────────────────────────

@router.get("/banners", response_model=List[HeroBannerResponse])
def list_banners(active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(HeroBannerModel)
    if active_only:
        now = datetime.utcnow()
        query = query.filter(
            HeroBannerModel.is_active == True,
            (HeroBannerModel.start_date == None) | (HeroBannerModel.start_date <= now),
            (HeroBannerModel.end_date == None) | (HeroBannerModel.end_date >= now)
        )
    return query.order_by(HeroBannerModel.display_order.asc(), HeroBannerModel.created_at.desc()).all()


@router.get("/banners/{banner_id}", response_model=HeroBannerResponse)
def get_banner(banner_id: UUID, db: Session = Depends(get_db)):
    banner = db.get(HeroBannerModel, banner_id)
    if not banner:
        raise HTTPException(404, "Banner not found")
    return banner


@router.post("/banners", response_model=HeroBannerResponse, status_code=201, dependencies=[Depends(require_admin)])
def create_banner(dto: HeroBannerCreate, db: Session = Depends(get_db)):
    banner = HeroBannerModel(**dto.model_dump())
    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner


@router.put("/banners/{banner_id}", response_model=HeroBannerResponse, dependencies=[Depends(require_admin)])
def update_banner(banner_id: UUID, dto: HeroBannerCreate, db: Session = Depends(get_db)):
    banner = db.get(HeroBannerModel, banner_id)
    if not banner:
        raise HTTPException(404, "Banner not found")
    for field, value in dto.model_dump().items():
        setattr(banner, field, value)
    db.commit()
    db.refresh(banner)
    return banner


@router.delete("/banners/{banner_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_banner(banner_id: UUID, db: Session = Depends(get_db)):
    banner = db.get(HeroBannerModel, banner_id)
    if not banner:
        raise HTTPException(404, "Banner not found")
    db.delete(banner)
    db.commit()


# ── COUPOUNS ENDPOINTS ────────────────────────────────────────────────────────

@router.get("/coupons", response_model=List[CouponResponse])
def list_coupons(active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(CouponModel)
    if active_only:
        now = datetime.utcnow()
        query = query.filter(
            CouponModel.is_active == True,
            CouponModel.start_date <= now,
            CouponModel.end_date >= now
        )
    return query.order_by(CouponModel.created_at.desc()).all()


@router.get("/coupons/{coupon_id}", response_model=CouponResponse)
def get_coupon(coupon_id: UUID, db: Session = Depends(get_db)):
    coupon = db.get(CouponModel, coupon_id)
    if not coupon:
        raise HTTPException(404, "Coupon not found")
    return coupon


@router.post("/coupons", response_model=CouponResponse, status_code=201, dependencies=[Depends(require_admin)])
def create_coupon(dto: CouponCreate, db: Session = Depends(get_db)):
    existing = db.query(CouponModel).filter(CouponModel.code.ilike(dto.code)).first()
    if existing:
        raise HTTPException(400, "Coupon code already exists")
    coupon = CouponModel(**dto.model_dump())
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.put("/coupons/{coupon_id}", response_model=CouponResponse, dependencies=[Depends(require_admin)])
def update_coupon(coupon_id: UUID, dto: CouponCreate, db: Session = Depends(get_db)):
    coupon = db.get(CouponModel, coupon_id)
    if not coupon:
        raise HTTPException(404, "Coupon not found")
    for field, value in dto.model_dump().items():
        setattr(coupon, field, value)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.delete("/coupons/{coupon_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_coupon(coupon_id: UUID, db: Session = Depends(get_db)):
    coupon = db.get(CouponModel, coupon_id)
    if not coupon:
        raise HTTPException(404, "Coupon not found")
    db.delete(coupon)
    db.commit()


# ── FLASH SALES ENDPOINTS ─────────────────────────────────────────────────────

@router.get("/flash-sales", response_model=List[FlashSaleResponse])
def list_flash_sales(active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(FlashSaleModel)
    if active_only:
        now = datetime.utcnow()
        query = query.filter(
            FlashSaleModel.is_active == True,
            FlashSaleModel.start_date <= now,
            FlashSaleModel.end_date >= now
        )
    sales = query.order_by(FlashSaleModel.start_date.desc()).all()

    for s in sales:
        product = db.get(ProductModel, s.product_id)
        if product:
            s.product_name = product.name
            s.product_price = product.price
            s.product_image = product.image
            brand = db.get(BrandModel, product.brand_id)
            s.brand_name = brand.name if brand else "Unknown"

    return sales


@router.get("/flash-sales/{flash_sale_id}", response_model=FlashSaleResponse)
def get_flash_sale(flash_sale_id: UUID, db: Session = Depends(get_db)):
    s = db.get(FlashSaleModel, flash_sale_id)
    if not s:
        raise HTTPException(404, "Flash sale not found")
    product = db.get(ProductModel, s.product_id)
    if product:
        s.product_name = product.name
        s.product_price = product.price
        s.product_image = product.image
        brand = db.get(BrandModel, product.brand_id)
        s.brand_name = brand.name if brand else "Unknown"
    return s


@router.post("/flash-sales", response_model=FlashSaleResponse, status_code=201, dependencies=[Depends(require_admin)])
def create_flash_sale(dto: FlashSaleCreate, db: Session = Depends(get_db)):
    # Check product exists
    product = db.get(ProductModel, dto.product_id)
    if not product:
        raise HTTPException(400, "Product not found")

    sale = FlashSaleModel(**dto.model_dump())
    db.add(sale)
    db.commit()
    db.refresh(sale)

    sale.product_name = product.name
    sale.product_price = product.price
    sale.product_image = product.image
    brand = db.get(BrandModel, product.brand_id)
    sale.brand_name = brand.name if brand else "Unknown"
    return sale


@router.put("/flash-sales/{flash_sale_id}", response_model=FlashSaleResponse, dependencies=[Depends(require_admin)])
def update_flash_sale(flash_sale_id: UUID, dto: FlashSaleCreate, db: Session = Depends(get_db)):
    sale = db.get(FlashSaleModel, flash_sale_id)
    if not sale:
        raise HTTPException(404, "Flash sale not found")

    product = db.get(ProductModel, dto.product_id)
    if not product:
        raise HTTPException(400, "Product not found")

    for field, value in dto.model_dump().items():
        setattr(sale, field, value)

    db.commit()
    db.refresh(sale)

    sale.product_name = product.name
    sale.product_price = product.price
    sale.product_image = product.image
    brand = db.get(BrandModel, product.brand_id)
    sale.brand_name = brand.name if brand else "Unknown"
    return sale


@router.delete("/flash-sales/{flash_sale_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_flash_sale(flash_sale_id: UUID, db: Session = Depends(get_db)):
    sale = db.get(FlashSaleModel, flash_sale_id)
    if not sale:
        raise HTTPException(404, "Flash sale not found")
    db.delete(sale)
    db.commit()


# ── MEDIA LIBRARY ENDPOINTS ───────────────────────────────────────────────────

@router.get("/media", response_model=List[MediaLibraryResponse])
def list_media(db: Session = Depends(get_db)):
    # Automatically register files in static/images if not in DB, to sync
    import os
    db_media = db.query(MediaLibraryModel).all()
    db_urls = {m.url for m in db_media}

    image_dir = os.path.join("static", "images")
    if os.path.exists(image_dir):
        for f in os.listdir(image_dir):
            if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
                url = f"/static/images/{f}"
                if url not in db_urls:
                    new_media = MediaLibraryModel(filename=f, url=url)
                    db.add(new_media)
        db.commit()
        db_media = db.query(MediaLibraryModel).order_by(MediaLibraryModel.created_at.desc()).all()

    return db_media


@router.delete("/media/{media_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_media(media_id: UUID, db: Session = Depends(get_db)):
    media = db.get(MediaLibraryModel, media_id)
    if not media:
        raise HTTPException(404, "Media item not found")

    # Try to delete from disk
    import os
    file_path = os.path.join("static", "images", media.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

    db.delete(media)
    db.commit()


# ── DASHBOARD STATS ───────────────────────────────────────────────────────────

@router.get("/dashboard/stats", dependencies=[Depends(require_admin)])
def get_dashboard_stats(db: Session = Depends(get_db)):
    now = datetime.utcnow()

    # Counts
    total_brands = db.query(BrandModel).count()
    active_offers = db.query(OfferModel).filter(
        OfferModel.is_active == True,
        OfferModel.start_date <= now,
        OfferModel.end_date >= now
    ).count()
    scheduled_offers = db.query(OfferModel).filter(
        OfferModel.is_active == True,
        OfferModel.start_date > now
    ).count()
    expired_offers = db.query(OfferModel).filter(
        (OfferModel.is_active == False) | (OfferModel.end_date < now)
    ).count()
    total_banners = db.query(HeroBannerModel).count()
    total_coupons = db.query(CouponModel).count()
    active_campaigns = db.query(PromotionalCampaignModel).filter(
        PromotionalCampaignModel.is_active == True,
        PromotionalCampaignModel.start_date <= now,
        PromotionalCampaignModel.end_date >= now
    ).count()

    total_clicks = db.query(func.sum(OfferModel.clicks_count)).scalar() or 0
    total_views = db.query(func.sum(OfferModel.views_count)).scalar() or 0

    # Offer performance chart data (Top 5 offers by click-through-rate or clicks)
    top_offers_by_clicks = db.query(OfferModel).order_by(OfferModel.clicks_count.desc()).limit(5).all()
    offer_performance = [
        {"title": o.title, "clicks": o.clicks_count, "views": o.views_count}
        for o in top_offers_by_clicks
    ]

    # Brand clicks chart data
    top_brands_by_clicks = db.query(
        BrandModel.name,
        func.sum(OfferModel.clicks_count).label("clicks")
    ).join(OfferModel).group_by(BrandModel.name).order_by(func.sum(OfferModel.clicks_count).desc()).limit(5).all()

    brand_analytics = [
        {"name": b[0], "clicks": int(b[1] or 0)}
        for b in top_brands_by_clicks
    ]

    return {
        "summary": {
            "totalBrands": total_brands,
            "activeOffers": active_offers,
            "scheduledOffers": scheduled_offers,
            "expiredOffers": expired_offers,
            "totalBanners": total_banners,
            "totalCoupons": total_coupons,
            "activeCampaigns": active_campaigns,
            "totalClicks": total_clicks,
            "totalViews": total_views
        },
        "charts": {
            "offerPerformance": offer_performance,
            "brandAnalytics": brand_analytics
        }
    }
