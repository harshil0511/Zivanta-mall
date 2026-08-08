from dataclasses import dataclass


@dataclass
class Category:
    id: str
    name: str
    icon: str = "🏷️"
    count: int = 0
