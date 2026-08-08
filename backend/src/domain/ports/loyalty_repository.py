from abc import ABC, abstractmethod
from typing import List, Optional

from src.domain.entities.loyalty_member import LoyaltyMember


class LoyaltyRepository(ABC):

    @abstractmethod
    def save(self, member: LoyaltyMember) -> LoyaltyMember:
        ...

    @abstractmethod
    def find_by_email(self, email: str) -> Optional[LoyaltyMember]:
        ...

    @abstractmethod
    def find_all(self) -> List[LoyaltyMember]:
        ...
