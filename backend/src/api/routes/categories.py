from typing import List
from fastapi import APIRouter, Depends

from src.application.services.category_service import CategoryService
from src.application.dtos.category_dto import CategoryResponseDTO, CreateCategoryDTO
from src.api.dependencies import get_category_service, require_admin

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponseDTO])
def list_categories(service: CategoryService = Depends(get_category_service)):
    return service.get_all()


@router.post("", response_model=CategoryResponseDTO, dependencies=[Depends(require_admin)])
def create_category(dto: CreateCategoryDTO, service: CategoryService = Depends(get_category_service)):
    return service.create(dto)
