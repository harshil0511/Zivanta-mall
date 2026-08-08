from typing import List
from src.domain.ports.category_repository import CategoryRepository
from src.application.dtos.category_dto import CategoryResponseDTO, CreateCategoryDTO
from src.domain.entities.category import Category


class CategoryService:
    def __init__(self, repo: CategoryRepository):
        self._repo = repo

    def get_all(self) -> List[CategoryResponseDTO]:
        return [
            CategoryResponseDTO(id=c.id, name=c.name, icon=c.icon, count=c.count)
            for c in self._repo.find_all()
        ]

    def create(self, dto: CreateCategoryDTO) -> CategoryResponseDTO:
        cat = Category(id=dto.id, name=dto.name, icon=dto.icon, count=dto.count)
        saved = self._repo.save(cat)
        return CategoryResponseDTO(id=saved.id, name=saved.name, icon=saved.icon, count=saved.count)
