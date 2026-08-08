from abc import ABC, abstractmethod
from typing import List

from src.domain.entities.leasing_inquiry import LeasingInquiry


class LeasingRepository(ABC):

    @abstractmethod
    def save(self, inquiry: LeasingInquiry) -> LeasingInquiry:
        ...

    @abstractmethod
    def find_all(self) -> List[LeasingInquiry]:
        ...
