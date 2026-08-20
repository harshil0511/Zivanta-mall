import re
import uuid
from typing import Iterable, List, Optional, Set
from src.domain.entities.brand import Brand, Product
from src.domain.ports.brand_repository import BrandRepository
from src.application.dtos.brand_dto import CreateBrandDTO, ProductDTO, UpdateBrandDTO, BrandResponseDTO


class BrandService:
    def __init__(self, repo: BrandRepository):
        self._repo = repo

    def get_all(self) -> List[BrandResponseDTO]:
        brands = self._repo.find_all()
        return [self._to_dto(b) for b in brands]

    def get_by_id(self, brand_id: str) -> Optional[BrandResponseDTO]:
        brand = self._repo.find_by_id(brand_id)
        return self._to_dto(brand) if brand else None

    def create(self, dto: CreateBrandDTO) -> BrandResponseDTO:
        brand = Brand(
            id=dto.id,
            name=dto.name,
            floor=dto.floor,
            type=dto.type,
            description=dto.description,
            featured=dto.featured,
            logo_url=dto.logo_url,
            cover_image_url=dto.cover_image_url,
            priority=dto.priority,
            is_active=dto.is_active,
            website_url=dto.website_url,
            products=[],
        )
        saved = self._repo.save(brand)

        self._sync_products(saved.id, dto.products)

        return self._to_dto(self._repo.find_by_id(saved.id))

    def update(self, brand_id: str, dto: UpdateBrandDTO) -> Optional[BrandResponseDTO]:
        brand = self._repo.find_by_id(brand_id)
        if not brand:
            return None

        if dto.name is not None:            brand.name            = dto.name
        if dto.floor is not None:           brand.floor           = dto.floor
        if dto.type is not None:            brand.type            = dto.type
        if dto.description is not None:     brand.description     = dto.description
        if dto.featured is not None:        brand.featured        = dto.featured
        if dto.logo_url is not None:        brand.logo_url        = dto.logo_url
        if dto.cover_image_url is not None: brand.cover_image_url = dto.cover_image_url
        if dto.priority is not None:        brand.priority        = dto.priority
        if dto.is_active is not None:       brand.is_active       = dto.is_active
        if dto.website_url is not None:     brand.website_url     = dto.website_url

        self._repo.save(brand)

        if dto.products is not None:
            self._sync_products(brand_id, dto.products)

        return self._to_dto(self._repo.find_by_id(brand_id))

    def _sync_products(self, brand_id: str, products: Iterable[ProductDTO]) -> None:
        """Persist the submitted products as the brand's full catalogue.

        Rows that are still present are updated in place so records that
        reference them (flash sales, offers) survive the edit; only rows that
        were dropped from the submission are deleted.
        """
        brand = self._repo.find_by_id(brand_id)
        existing_ids = {p.id for p in brand.products} if brand else set()
        kept_ids: Set[str] = set()

        for p in products:
            if not p.name.strip():
                continue
            product_id = p.id or self._generate_product_id(
                brand_id, p.name, existing_ids | kept_ids
            )
            self._repo.save_product(
                Product(
                    id=product_id,
                    brand_id=brand_id,
                    name=p.name,
                    price=p.price,
                    rating=p.rating,
                    category=p.category,
                    image=p.image,
                )
            )
            kept_ids.add(product_id)

        for stale_id in existing_ids - kept_ids:
            self._repo.delete_product(stale_id)

    @staticmethod
    def _generate_product_id(brand_id: str, name: str, taken: Set[str]) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:40] or "item"
        candidate = f"p-{brand_id}-{slug}"
        suffix = 2
        while candidate in taken:
            candidate = f"p-{brand_id}-{slug}-{suffix}"
            suffix += 1
            if suffix > 50:
                candidate = f"p-{brand_id}-{uuid.uuid4().hex[:8]}"
                break
        return candidate

    def delete(self, brand_id: str) -> bool:
        brand = self._repo.find_by_id(brand_id)
        if not brand:
            return False
        self._repo.delete(brand_id)
        return True

    @staticmethod
    def _to_dto(brand: Brand) -> BrandResponseDTO:
        return BrandResponseDTO(
            id=brand.id,
            name=brand.name,
            floor=brand.floor,
            type=brand.type,
            description=brand.description,
            featured=brand.featured,
            logo_url=brand.logo_url,
            cover_image_url=brand.cover_image_url,
            priority=brand.priority,
            is_active=brand.is_active,
            website_url=brand.website_url,
            products=[
                ProductDTO(
                    id=p.id, brand_id=p.brand_id, name=p.name,
                    price=p.price, rating=p.rating,
                    category=p.category, image=p.image,
                )
                for p in brand.products
            ],
        )
