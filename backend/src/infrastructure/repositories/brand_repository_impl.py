"""Adapter — concrete PostgreSQL implementation of BrandRepository port."""
from typing import List, Optional

from sqlalchemy.orm import Session

from src.domain.entities.brand import Brand, Product
from src.domain.ports.brand_repository import BrandRepository
from src.infrastructure.database.models import BrandModel, ProductModel


def _model_to_entity(m: BrandModel) -> Brand:
    return Brand(
        id=m.id,
        name=m.name,
        floor=m.floor,
        type=m.type,
        description=m.description or "",
        featured=m.featured,
        logo_url=m.logo_url,
        cover_image_url=m.cover_image_url,
        priority=m.priority,
        is_active=m.is_active,
        website_url=m.website_url,
        products=[
            Product(
                id=p.id, brand_id=p.brand_id, name=p.name,
                price=p.price, rating=p.rating,
                category=p.category, image=p.image or "",
            )
            for p in m.products
        ],
    )


class SQLBrandRepository(BrandRepository):
    def __init__(self, db: Session):
        self._db = db

    def find_all(self) -> List[Brand]:
        rows = self._db.query(BrandModel).order_by(BrandModel.priority.desc(), BrandModel.name).all()
        return [_model_to_entity(r) for r in rows]

    def find_by_id(self, brand_id: str) -> Optional[Brand]:
        row = self._db.get(BrandModel, brand_id)
        return _model_to_entity(row) if row else None

    def save(self, brand: Brand) -> Brand:
        existing = self._db.get(BrandModel, brand.id)
        if existing:
            existing.name            = brand.name
            existing.floor           = brand.floor
            existing.type            = brand.type
            existing.description     = brand.description
            existing.featured        = brand.featured
            existing.logo_url        = brand.logo_url
            existing.cover_image_url = brand.cover_image_url
            existing.priority        = brand.priority
            existing.is_active       = brand.is_active
            existing.website_url     = brand.website_url
            self._db.commit()
            self._db.refresh(existing)
            return _model_to_entity(existing)
        else:
            row = BrandModel(
                id=brand.id, name=brand.name, floor=brand.floor,
                type=brand.type, description=brand.description,
                featured=brand.featured, logo_url=brand.logo_url,
                cover_image_url=brand.cover_image_url, priority=brand.priority,
                is_active=brand.is_active, website_url=brand.website_url,
            )
            self._db.add(row)
            self._db.commit()
            self._db.refresh(row)
            return _model_to_entity(row)

    def delete(self, brand_id: str) -> None:
        row = self._db.get(BrandModel, brand_id)
        if row:
            self._db.delete(row)
            self._db.commit()

    def save_product(self, product: Product) -> Product:
        existing = self._db.get(ProductModel, product.id)
        if existing:
            existing.name     = product.name
            existing.price    = product.price
            existing.rating   = product.rating
            existing.category = product.category
            existing.image    = product.image
            self._db.commit()
            return product
        else:
            row = ProductModel(
                id=product.id, brand_id=product.brand_id,
                name=product.name, price=product.price,
                rating=product.rating, category=product.category,
                image=product.image,
            )
            self._db.add(row)
            self._db.commit()
            return product

    def delete_product(self, product_id: str) -> None:
        row = self._db.get(ProductModel, product_id)
        if row:
            self._db.delete(row)
            self._db.commit()

    def delete_products_by_brand(self, brand_id: str) -> None:
        self._db.query(ProductModel).filter(
            ProductModel.brand_id == brand_id
        ).delete(synchronize_session=False)
        self._db.commit()
