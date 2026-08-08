from typing import List, Optional
from src.domain.entities.brand import Brand, Product
from src.domain.ports.brand_repository import BrandRepository
from src.application.dtos.brand_dto import CreateBrandDTO, UpdateBrandDTO, BrandResponseDTO


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

        # Save products
        self._repo.delete_products_by_brand(saved.id)
        for p in dto.products:
            product = Product(
                id=p.id or f"p-{saved.id}-{len(saved.products)}",
                brand_id=saved.id,
                name=p.name,
                price=p.price,
                rating=p.rating,
                category=p.category,
                image=p.image,
            )
            self._repo.save_product(product)

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
            self._repo.delete_products_by_brand(brand_id)
            for p in dto.products:
                product = Product(
                    id=p.id or f"p-{brand_id}-{p.name[:4]}",
                    brand_id=brand_id,
                    name=p.name,
                    price=p.price,
                    rating=p.rating,
                    category=p.category,
                    image=p.image,
                )
                self._repo.save_product(product)

        return self._to_dto(self._repo.find_by_id(brand_id))

    def delete(self, brand_id: str) -> bool:
        brand = self._repo.find_by_id(brand_id)
        if not brand:
            return False
        self._repo.delete(brand_id)
        return True

    @staticmethod
    def _to_dto(brand: Brand) -> BrandResponseDTO:
        from src.application.dtos.brand_dto import ProductDTO
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
