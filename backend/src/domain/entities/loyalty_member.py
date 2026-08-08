from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class LoyaltyMember:
    name: str
    email: str
    tier: str = "Silver"
    points: int = 0
    id: Optional[str] = None
    created_at: Optional[datetime] = None
