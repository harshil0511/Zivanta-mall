from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class ProductDTO(BaseModel):
    id: Optional[str] = None
    brand_id: Optional[str] = None
    name: str = ""
    price: str = ""
    rating: float = 5.0
    category: str = ""
    image: str = ""

    model_config = {"from_attributes": True}

    # Coerce explicit JSON null (e.g. {"name": null}) to "" so a partially
    # filled product from the admin never triggers a 422.
    @field_validator("name", "price", "category", "image", mode="before")
    @classmethod
    def _none_to_empty(cls, v):
        return "" if v is None else v

    @field_validator("rating", mode="before")
    @classmethod
    def _none_to_default_rating(cls, v):
        return 5.0 if v is None else v


class CreateBrandDTO(BaseModel):
    id: str
    name: str
    floor: str = "Level 1"
    type: str = "Fashion"
    description: str = ""
    featured: bool = False
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    priority: int = 0
    is_active: bool = True
    website_url: Optional[str] = None
    products: List[ProductDTO] = []


class UpdateBrandDTO(BaseModel):
    name: Optional[str] = None
    floor: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    priority: Optional[int] = None
    is_active: Optional[bool] = None
    website_url: Optional[str] = None
    products: Optional[List[ProductDTO]] = None


class BrandResponseDTO(BaseModel):
    id: str
    name: str
    floor: str
    type: str
    description: str
    featured: bool
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    priority: int = 0
    is_active: bool = True
    website_url: Optional[str] = None
    products: List[ProductDTO] = []

    model_config = {"from_attributes": True}
