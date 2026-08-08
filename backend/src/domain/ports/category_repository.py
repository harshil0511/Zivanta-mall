from abc import ABC, abstractmethod
from typing import List, Optional

from src.domain.entities.category import Category


class CategoryRepository(ABC):

    @abstractmethod
    def find_all(self) -> List[Category]:
        ...

    @abstractmethod
    def find_by_id(self, category_id: str) -> Optional[Category]:
        ...

    @abstractmethod
    def save(self, category: Category) -> Category:
        ...
