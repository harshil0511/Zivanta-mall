from pydantic import BaseModel
from typing import Optional


class CategoryResponseDTO(BaseModel):
    id: str
    name: str
    icon: str = "🏷️"
    count: int = 0

    model_config = {"from_attributes": True}


class CreateCategoryDTO(BaseModel):
    id: str
    name: str
    icon: str = "🏷️"
    count: int = 0
