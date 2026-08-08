from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class LeasingInquiry:
    full_name: str
    company_name: str
    email: str
    category: str
    message: str = ""
    id: Optional[str] = None
    created_at: Optional[datetime] = None
