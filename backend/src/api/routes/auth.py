from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from src.infrastructure.database.connection import settings, get_db
from src.infrastructure.database.models import AdminUserModel
from src.infrastructure.security import verify_password
from src.application.dtos.loyalty_dto import AuthLoginDTO, TokenResponseDTO

router = APIRouter(prefix="/api/auth", tags=["Auth"])
bearer = HTTPBearer()


def _authenticate(db: Session, email: str, password: str) -> bool:
    """True if the credentials match a DB admin, or the env admin as fallback."""
    email = email.strip().lower()

    admin = (
        db.query(AdminUserModel)
        .filter(AdminUserModel.email == email)
        .one_or_none()
    )
    if admin is not None and verify_password(password, admin.password_hash):
        return True

    # Fallback to env-configured credentials (covers first boot before seeding).
    return email == settings.ADMIN_EMAIL.strip().lower() and password == settings.ADMIN_PASSWORD


@router.post("/login", response_model=TokenResponseDTO)
def login(dto: AuthLoginDTO, db: Session = Depends(get_db)):
    if not _authenticate(db, dto.email, dto.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    expire  = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": dto.email.strip().lower(), "role": "admin", "exp": expire}
    token   = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return TokenResponseDTO(access_token=token)


@router.post("/verify")
def verify(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    """Quick token validity check — reads the bearer token from the
    Authorization header. Returns 200 if valid, 401 otherwise."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return {"valid": True, "role": payload.get("role")}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
