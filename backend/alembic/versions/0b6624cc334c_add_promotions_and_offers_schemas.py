"""add promotions and offers schemas

Revision ID: 0b6624cc334c
Revises: 001
Create Date: 2026-07-09 15:12:38.230606
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = '0b6624cc334c'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Update brands ─────────────────────────────────────────────────────────
    op.add_column("brands", sa.Column("logo_url", sa.String(1000), nullable=True))
    op.add_column("brands", sa.Column("cover_image_url", sa.String(1000), nullable=True))
    op.add_column("brands", sa.Column("priority", sa.Integer(), server_default="0", nullable=False))
    op.add_column("brands", sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False))
    op.add_column("brands", sa.Column("website_url", sa.String(1000), nullable=True))

    # ── Update categories ─────────────────────────────────────────────────────
    op.add_column("categories", sa.Column("display_order", sa.Integer(), server_default="0", nullable=False))

    # ── promotional_campaigns ─────────────────────────────────────────────────
    op.create_table(
        "promotional_campaigns",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("subtitle", sa.String(300), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("campaign_type", sa.String(100), server_default="general", nullable=False),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("background_image_url", sa.String(1000), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── hero_banners ──────────────────────────────────────────────────────────
    op.create_table(
        "hero_banners",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("banner_type", sa.String(50), server_default="hero", nullable=False),
        sa.Column("image_url", sa.String(1000), nullable=False),
        sa.Column("mobile_image_url", sa.String(1000), nullable=True),
        sa.Column("cta_text", sa.String(100), nullable=True),
        sa.Column("redirect_url", sa.String(1000), nullable=True),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── offers ────────────────────────────────────────────────────────────────
    op.create_table(
        "offers",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("brand_id", sa.String(), sa.ForeignKey("brands.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("subtitle", sa.String(300), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("discount_percentage", sa.Integer(), nullable=True),
        sa.Column("flat_discount", sa.Float(), nullable=True),
        sa.Column("coupon_code", sa.String(50), nullable=True),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("background_color", sa.String(50), server_default="#14122E", nullable=False),
        sa.Column("text_color", sa.String(50), server_default="#F0EEF8", nullable=False),
        sa.Column("display_priority", sa.Integer(), server_default="0", nullable=False),
        sa.Column("tags", sa.Text(), nullable=True),
        sa.Column("banner_url", sa.String(1000), nullable=True),
        sa.Column("mobile_banner_url", sa.String(1000), nullable=True),
        sa.Column("desktop_banner_url", sa.String(1000), nullable=True),
        sa.Column("is_featured", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("is_trending", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("views_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("clicks_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_offers_brand_id", "offers", ["brand_id"])

    # ── coupons ───────────────────────────────────────────────────────────────
    op.create_table(
        "coupons",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("code", sa.String(50), unique=True, nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("discount_value", sa.Float(), nullable=False),
        sa.Column("discount_type", sa.String(50), server_default="percentage", nullable=False),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── flash_sales ───────────────────────────────────────────────────────────
    op.create_table(
        "flash_sales",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("product_id", sa.String(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("discount_price", sa.String(50), nullable=False),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_flash_sales_product_id", "flash_sales", ["product_id"])

    # ── media_library ─────────────────────────────────────────────────────────
    op.create_table(
        "media_library",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("url", sa.String(1000), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("media_library")
    op.drop_index("ix_flash_sales_product_id", "flash_sales")
    op.drop_table("flash_sales")
    op.drop_table("coupons")
    op.drop_index("ix_offers_brand_id", "offers")
    op.drop_table("offers")
    op.drop_table("hero_banners")
    op.drop_table("promotional_campaigns")

    op.drop_column("categories", "display_order")

    op.drop_column("brands", "website_url")
    op.drop_column("brands", "is_active")
    op.drop_column("brands", "priority")
    op.drop_column("brands", "cover_image_url")
    op.drop_column("brands", "logo_url")
