from typing import List

from src.domain.entities.leasing_inquiry import LeasingInquiry
from src.domain.ports.leasing_repository import LeasingRepository
from src.application.dtos.leasing_dto import LeasingInquiryCreateDTO, LeasingInquiryResponseDTO


class LeasingService:
    def __init__(self, repo: LeasingRepository):
        self._repo = repo

    def list_all(self) -> List[LeasingInquiryResponseDTO]:
        return [LeasingInquiryResponseDTO.model_validate(i) for i in self._repo.find_all()]

    def submit(self, dto: LeasingInquiryCreateDTO) -> LeasingInquiryResponseDTO:
        inquiry = LeasingInquiry(
            full_name=dto.full_name,
            company_name=dto.company_name,
            email=dto.email,
            category=dto.category,
            message=dto.message,
        )
        saved = self._repo.save(inquiry)
        return LeasingInquiryResponseDTO(
            id=str(saved.id),
            full_name=saved.full_name,
            company_name=saved.company_name,
            email=saved.email,
            category=saved.category,
            message=saved.message,
            created_at=saved.created_at,
        )
