from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class LeasingInquiryCreateDTO(BaseModel):
    full_name: str
    company_name: str
    email: str
    category: str
    message: str = ""


class LeasingInquiryResponseDTO(BaseModel):
    id: str
    full_name: str
    company_name: str
    email: str
    category: str
    message: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
