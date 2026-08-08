from typing import List

from fastapi import APIRouter, Depends, status

from src.application.services.leasing_service import LeasingService
from src.application.dtos.leasing_dto import LeasingInquiryCreateDTO, LeasingInquiryResponseDTO
from src.api.dependencies import get_leasing_service, require_admin

router = APIRouter(prefix="/api/leasing", tags=["Leasing"])


@router.post("", response_model=LeasingInquiryResponseDTO, status_code=status.HTTP_201_CREATED)
def submit_inquiry(dto: LeasingInquiryCreateDTO, service: LeasingService = Depends(get_leasing_service)):
    return service.submit(dto)


@router.get("", response_model=List[LeasingInquiryResponseDTO], dependencies=[Depends(require_admin)])
def list_inquiries(service: LeasingService = Depends(get_leasing_service)):
    """Admin-only — list all leasing inquiries (newest first)."""
    return service.list_all()
