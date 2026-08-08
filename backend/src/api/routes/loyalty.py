from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.application.services.loyalty_service import LoyaltyService
from src.application.dtos.loyalty_dto import LoyaltyJoinDTO, LoyaltyResponseDTO
from src.api.dependencies import get_loyalty_service, require_admin

router = APIRouter(prefix="/api/loyalty", tags=["Loyalty"])


@router.post("/join", response_model=LoyaltyResponseDTO, status_code=status.HTTP_201_CREATED)
def join(dto: LoyaltyJoinDTO, service: LoyaltyService = Depends(get_loyalty_service)):
    try:
        return service.join(dto)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("", response_model=List[LoyaltyResponseDTO], dependencies=[Depends(require_admin)])
def list_members(service: LoyaltyService = Depends(get_loyalty_service)):
    """Admin-only — list all loyalty members (newest first)."""
    return service.list_all()
