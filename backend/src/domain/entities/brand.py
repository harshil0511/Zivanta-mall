"""Domain entity — no framework dependencies."""
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Product:
    id: str
    brand_id: str
    name: str
    price: str
    rating: float
    category: str
    image: str = ""


@dataclass
class Brand:
    id: str
    name: str
    floor: str
    type: str
    description: str = ""
    featured: bool = False
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    priority: int = 0
    is_active: bool = True
    website_url: Optional[str] = None
    products: List[Product] = field(default_factory=list)
