from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LoyaltyJoinDTO(BaseModel):
    name: str
    email: str


class LoyaltyResponseDTO(BaseModel):
    id: str
    name: str
    email: str
    tier: str
    points: int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AuthLoginDTO(BaseModel):
    email: str
    password: str


class TokenResponseDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"
