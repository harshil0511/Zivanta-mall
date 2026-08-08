from typing import List

from src.domain.entities.loyalty_member import LoyaltyMember
from src.domain.ports.loyalty_repository import LoyaltyRepository
from src.application.dtos.loyalty_dto import LoyaltyJoinDTO, LoyaltyResponseDTO


class LoyaltyService:
    def __init__(self, repo: LoyaltyRepository):
        self._repo = repo

    def list_all(self) -> List[LoyaltyResponseDTO]:
        return [LoyaltyResponseDTO.model_validate(m) for m in self._repo.find_all()]

    def join(self, dto: LoyaltyJoinDTO) -> LoyaltyResponseDTO:
        existing = self._repo.find_by_email(dto.email)
        if existing:
            raise ValueError("This email is already a loyalty member.")

        member = LoyaltyMember(name=dto.name, email=dto.email)
        saved  = self._repo.save(member)
        return LoyaltyResponseDTO(
            id=str(saved.id),
            name=saved.name,
            email=saved.email,
            tier=saved.tier,
            points=saved.points,
            created_at=saved.created_at,
        )
