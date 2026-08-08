"""FastAPI dependency injection — wires ports to adapters."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from src.infrastructure.database.connection import get_db, settings
from src.infrastructure.repositories.brand_repository_impl    import SQLBrandRepository
from src.infrastructure.repositories.category_repository_impl import SQLCategoryRepository
from src.infrastructure.repositories.leasing_repository_impl  import SQLLeasingRepository
from src.infrastructure.repositories.loyalty_repository_impl  import SQLLoyaltyRepository
from src.application.services.brand_service    import BrandService
from src.application.services.category_service import CategoryService
from src.application.services.leasing_service  import LeasingService
from src.application.services.loyalty_service  import LoyaltyService

bearer = HTTPBearer()


# ── Service factories ────────────────────────────────────────────────────────

def get_brand_service(db: Session = Depends(get_db)) -> BrandService:
    return BrandService(SQLBrandRepository(db))

def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(SQLCategoryRepository(db))

def get_leasing_service(db: Session = Depends(get_db)) -> LeasingService:
    return LeasingService(SQLLeasingRepository(db))

def get_loyalty_service(db: Session = Depends(get_db)) -> LoyaltyService:
    return LoyaltyService(SQLLoyaltyRepository(db))


# ── Auth guard ───────────────────────────────────────────────────────────────

def require_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        if payload.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
