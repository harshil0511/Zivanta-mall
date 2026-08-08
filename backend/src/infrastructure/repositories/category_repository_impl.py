from typing import List, Optional
from sqlalchemy.orm import Session
from src.domain.entities.category import Category
from src.domain.ports.category_repository import CategoryRepository
from src.infrastructure.database.models import CategoryModel


class SQLCategoryRepository(CategoryRepository):
    def __init__(self, db: Session):
        self._db = db

    def find_all(self) -> List[Category]:
        rows = self._db.query(CategoryModel).order_by(CategoryModel.name).all()
        return [Category(id=r.id, name=r.name, icon=r.icon, count=r.count) for r in rows]

    def find_by_id(self, category_id: str) -> Optional[Category]:
        row = self._db.get(CategoryModel, category_id)
        return Category(id=row.id, name=row.name, icon=row.icon, count=row.count) if row else None

    def save(self, category: Category) -> Category:
        existing = self._db.get(CategoryModel, category.id)
        if existing:
            existing.name  = category.name
            existing.icon  = category.icon
            existing.count = category.count
            self._db.commit()
        else:
            row = CategoryModel(id=category.id, name=category.name, icon=category.icon, count=category.count)
            self._db.add(row)
            self._db.commit()
        return category
