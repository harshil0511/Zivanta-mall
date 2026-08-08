from typing import List, Optional
from sqlalchemy.orm import Session
from src.domain.entities.loyalty_member import LoyaltyMember
from src.domain.ports.loyalty_repository import LoyaltyRepository
from src.infrastructure.database.models import LoyaltyMemberModel


class SQLLoyaltyRepository(LoyaltyRepository):
    def __init__(self, db: Session):
        self._db = db

    def save(self, member: LoyaltyMember) -> LoyaltyMember:
        row = LoyaltyMemberModel(
            name=member.name, email=member.email,
            tier=member.tier, points=member.points,
        )
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        member.id         = str(row.id)
        member.created_at = row.created_at
        return member

    def find_by_email(self, email: str) -> Optional[LoyaltyMember]:
        row = self._db.query(LoyaltyMemberModel).filter(
            LoyaltyMemberModel.email == email
        ).first()
        if not row:
            return None
        return LoyaltyMember(
            id=str(row.id), name=row.name, email=row.email,
            tier=row.tier, points=row.points, created_at=row.created_at,
        )

    def find_all(self) -> List[LoyaltyMember]:
        rows = self._db.query(LoyaltyMemberModel).order_by(
            LoyaltyMemberModel.created_at.desc()
        ).all()
        return [
            LoyaltyMember(
                id=str(r.id), name=r.name, email=r.email,
                tier=r.tier, points=r.points, created_at=r.created_at,
            )
            for r in rows
        ]
