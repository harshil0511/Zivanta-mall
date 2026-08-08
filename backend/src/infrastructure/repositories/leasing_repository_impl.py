from typing import List
from sqlalchemy.orm import Session
from src.domain.entities.leasing_inquiry import LeasingInquiry
from src.domain.ports.leasing_repository import LeasingRepository
from src.infrastructure.database.models import LeasingInquiryModel


class SQLLeasingRepository(LeasingRepository):
    def __init__(self, db: Session):
        self._db = db

    def save(self, inquiry: LeasingInquiry) -> LeasingInquiry:
        row = LeasingInquiryModel(
            full_name=inquiry.full_name,
            company_name=inquiry.company_name,
            email=inquiry.email,
            category=inquiry.category,
            message=inquiry.message,
        )
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        inquiry.id         = str(row.id)
        inquiry.created_at = row.created_at
        return inquiry

    def find_all(self) -> List[LeasingInquiry]:
        rows = self._db.query(LeasingInquiryModel).order_by(
            LeasingInquiryModel.created_at.desc()
        ).all()
        return [
            LeasingInquiry(
                id=str(r.id), full_name=r.full_name, company_name=r.company_name,
                email=r.email, category=r.category, message=r.message,
                created_at=r.created_at,
            )
            for r in rows
        ]
