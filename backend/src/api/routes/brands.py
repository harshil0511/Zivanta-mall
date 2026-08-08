from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from src.application.services.brand_service import BrandService
from src.application.dtos.brand_dto import BrandResponseDTO, CreateBrandDTO, UpdateBrandDTO
from src.api.dependencies import get_brand_service, require_admin

router = APIRouter(prefix="/api/brands", tags=["Brands"])


@router.get("", response_model=List[BrandResponseDTO])
def list_brands(service: BrandService = Depends(get_brand_service)):
    return service.get_all()


@router.get("/{brand_id}", response_model=BrandResponseDTO)
def get_brand(brand_id: str, service: BrandService = Depends(get_brand_service)):
    brand = service.get_by_id(brand_id)
    if not brand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")
    return brand


@router.post("", response_model=BrandResponseDTO, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
def create_brand(dto: CreateBrandDTO, service: BrandService = Depends(get_brand_service)):
    return service.create(dto)


@router.put("/{brand_id}", response_model=BrandResponseDTO,
            dependencies=[Depends(require_admin)])
def update_brand(brand_id: str, dto: UpdateBrandDTO, service: BrandService = Depends(get_brand_service)):
    brand = service.update(brand_id, dto)
    if not brand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")
    return brand


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
def delete_brand(brand_id: str, service: BrandService = Depends(get_brand_service)):
    if not service.delete(brand_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")
