"""Ensure the admin_users table exists and a super-admin is seeded.

Runs at app startup. Idempotent — safe to run on every boot. This guarantees
there is always a valid admin login stored in the database, independent of
whether the .env file is read correctly.
"""
from sqlalchemy import inspect

from src.infrastructure.database.connection import engine, SessionLocal, settings
from src.infrastructure.database.models import AdminUserModel
from src.infrastructure.security import hash_password


def ensure_admin_seed() -> None:
    # 1. Create the table if it does not exist yet (no Alembic run needed).
    if not inspect(engine).has_table(AdminUserModel.__tablename__):
        AdminUserModel.__table__.create(bind=engine, checkfirst=True)

    # 2. Seed the admin from configured credentials if not already present.
    db = SessionLocal()
    try:
        email = settings.ADMIN_EMAIL.strip().lower()
        existing = (
            db.query(AdminUserModel)
            .filter(AdminUserModel.email == email)
            .one_or_none()
        )
        if existing is None:
            db.add(AdminUserModel(
                email=email,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                role="admin",
            ))
            db.commit()
            print(f"[admin-seed] created admin user: {email}")
        else:
            print(f"[admin-seed] admin user already present: {email}")
    finally:
        db.close()
