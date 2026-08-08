"""Initial schema — brands, products, categories, leasing_inquiries, loyalty_members

Revision ID: 001
Revises:
Create Date: 2025-05-14
"""
from typing import Sequence, Union
import uuid
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── brands ────────────────────────────────────────────────────────────────
    op.create_table(
        "brands",
        sa.Column("id",          sa.String(),  primary_key=True),
        sa.Column("name",        sa.String(200), nullable=False),
        sa.Column("floor",       sa.String(50),  nullable=False, server_default="Level 1"),
        sa.Column("type",        sa.String(100), nullable=False, server_default="Fashion"),
        sa.Column("description", sa.Text(),      server_default=""),
        sa.Column("featured",    sa.Boolean(),   server_default=sa.false()),
        sa.Column("created_at",  sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── products ──────────────────────────────────────────────────────────────
    op.create_table(
        "products",
        sa.Column("id",         sa.String(),  primary_key=True),
        sa.Column("brand_id",   sa.String(),  sa.ForeignKey("brands.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name",       sa.String(300), nullable=False),
        sa.Column("price",      sa.String(50),  nullable=False),
        sa.Column("rating",     sa.Float(),     server_default="5.0"),
        sa.Column("category",   sa.String(100), nullable=False),
        sa.Column("image",      sa.Text(),      server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_products_brand_id", "products", ["brand_id"])

    # ── categories ────────────────────────────────────────────────────────────
    op.create_table(
        "categories",
        sa.Column("id",         sa.String(),     primary_key=True),
        sa.Column("name",       sa.String(100),  nullable=False),
        sa.Column("icon",       sa.String(10),   server_default="🏷️"),
        sa.Column("count",      sa.Integer(),    server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── leasing_inquiries ─────────────────────────────────────────────────────
    op.create_table(
        "leasing_inquiries",
        sa.Column("id",           UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("full_name",    sa.String(200), nullable=False),
        sa.Column("company_name", sa.String(200), nullable=False),
        sa.Column("email",        sa.String(254), nullable=False),
        sa.Column("category",     sa.String(100), nullable=False),
        sa.Column("message",      sa.Text(),      server_default=""),
        sa.Column("created_at",   sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── loyalty_members ───────────────────────────────────────────────────────
    op.create_table(
        "loyalty_members",
        sa.Column("id",         UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email",      sa.String(254), unique=True, nullable=False),
        sa.Column("name",       sa.String(200), nullable=False),
        sa.Column("tier",       sa.String(50),  server_default="Silver"),
        sa.Column("points",     sa.Integer(),   server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── Seed data ─────────────────────────────────────────────────────────────
    op.execute("""
        INSERT INTO categories (id, name, icon, count) VALUES
          ('fashion',       'Fashion',       '👕', 45),
          ('jewellery',     'Jewellery',     '💎', 22),
          ('watches',       'Watches',       '⌚', 18),
          ('dining',        'Dining',        '🍽️', 34),
          ('entertainment', 'Entertainment', '🎬', 12)
        ON CONFLICT (id) DO NOTHING;
    """)

    op.execute("""
        INSERT INTO brands (id, name, floor, type, description, featured) VALUES
          ('dior',      'Dior',             'Level 1',      'Fashion',     'French luxury fashion house founded in 1946 by Christian Dior.', true),
          ('cartier',   'Cartier',          'Level 2',      'Jewellery',   'French luxury goods conglomerate designing jewelry and watches.', true),
          ('gucci',     'Gucci',            'Level 1',      'Fashion',     'Italian luxury brand of fashion and leather goods.',            true),
          ('rolex',     'Rolex',            'Level 2',      'Watches',     'Swiss luxury watch manufacturer based in Geneva.',               true),
          ('apple',     'Apple',            'Level 3',      'Electronics', 'The iconic technology giant offering the latest devices.',       false),
          ('nike',      'Nike',             'Level 3',      'Fashion',     'World''s leading designer of authentic athletic footwear.',      false),
          ('starbucks', 'Starbucks Reserve','Ground Floor', 'Dining',      'Premium coffee house experience with rare small-lot coffees.',   false),
          ('zara',      'Zara',             'Level 1',      'Fashion',     'Fast-fashion retailer known for high-trend clothing.',           false),
          ('sony',      'Sony Centre',      'Level 3',      'Electronics', 'Premium electronics brand in high-fidelity audio and gaming.',   false)
        ON CONFLICT (id) DO NOTHING;
    """)

    op.execute("""
        INSERT INTO products (id, brand_id, name, price, rating, category, image) VALUES
          ('d1',  'dior',      'Miss Dior Eau de Parfum',  '$145',    4.8, 'Fragrance', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80'),
          ('d2',  'dior',      'Lady Dior Bag',             '$5,300',  4.9, 'Bags',      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80'),
          ('d3',  'dior',      'Dior B23 High-Top',         '$1,200',  4.7, 'Shoes',     'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80'),
          ('c1',  'cartier',   'Love Bracelet',             '$6,900',  4.9, 'Jewellery', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'),
          ('c2',  'cartier',   'Tank Must Watch',           '$3,100',  4.8, 'Watches',   'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80'),
          ('g1',  'gucci',     'GG Marmont Bag',            '$2,550',  4.7, 'Bags',      'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?w=400&q=80'),
          ('g2',  'gucci',     'Princetown Slipper',        '$850',    4.6, 'Shoes',     'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80'),
          ('r1',  'rolex',     'Submariner Date',           '$10,100', 4.9, 'Watches',   'https://images.unsplash.com/photo-1587836374828-4dbaba94ee0e?w=400&q=80'),
          ('r2',  'rolex',     'Day-Date 40',               '$37,450', 5.0, 'Watches',   'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80'),
          ('a1',  'apple',     'iPhone 15 Pro',             '$999',    4.9, 'Mobile',    'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=80'),
          ('a2',  'apple',     'MacBook Air M3',            '$1,099',  4.8, 'Computing', 'https://images.unsplash.com/photo-1517336710211-447059341c33?w=400&q=80'),
          ('n1',  'nike',      'Air Jordan 1',              '$170',    4.9, 'Shoes',     'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80'),
          ('n2',  'nike',      'Tech Fleece Hoodie',        '$130',    4.7, 'Apparel',   'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80'),
          ('s1',  'starbucks', 'Caffè Latte',               '$5.50',   4.5, 'Beverage',  'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80'),
          ('s2',  'starbucks', 'Avocado Toast',             '$12.00',  4.2, 'Food',      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80'),
          ('z1',  'zara',      'Oversized Blazer',          '$129',    4.4, 'Apparel',   'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80'),
          ('sn1', 'sony',      'PlayStation 5',             '$499',    5.0, 'Gaming',    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80'),
          ('sn2', 'sony',      'WH-1000XM5',                '$399',    4.9, 'Audio',     'https://images.unsplash.com/photo-1618366712277-7ac8b7da0151?w=400&q=80')
        ON CONFLICT (id) DO NOTHING;
    """)


def downgrade() -> None:
    op.drop_table("loyalty_members")
    op.drop_table("leasing_inquiries")
    op.drop_table("categories")
    op.drop_index("ix_products_brand_id", "products")
    op.drop_table("products")
    op.drop_table("brands")
