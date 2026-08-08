"""Port (abstract interface) — defines what the application needs from persistence."""
from abc import ABC, abstractmethod
from typing import List, Optional

from src.domain.entities.brand import Brand, Product


class BrandRepository(ABC):

    @abstractmethod
    def find_all(self) -> List[Brand]:
        ...

    @abstractmethod
    def find_by_id(self, brand_id: str) -> Optional[Brand]:
        ...

    @abstractmethod
    def save(self, brand: Brand) -> Brand:
        ...

    @abstractmethod
    def delete(self, brand_id: str) -> None:
        ...

    @abstractmethod
    def save_product(self, product: Product) -> Product:
        ...

    @abstractmethod
    def delete_product(self, product_id: str) -> None:
        ...

    @abstractmethod
    def delete_products_by_brand(self, brand_id: str) -> None:
        ...
