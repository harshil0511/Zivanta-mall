import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.infrastructure.database.connection import settings
from src.api.routes import auth, brands, categories, leasing, loyalty, upload, chat, promotions


def create_app() -> FastAPI:
    app = FastAPI(
        title="Zivanta Luxury Mall API",
        description="FastAPI backend with hexagonal architecture for Zivanta Mall",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    # CORS
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(auth.router)
    app.include_router(brands.router)
    app.include_router(categories.router)
    app.include_router(leasing.router)
    app.include_router(loyalty.router)
    app.include_router(upload.router)
    app.include_router(chat.router)
    app.include_router(promotions.router)

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "Zivanta API"}

    # Static files for uploaded images — must be mounted after all routes
    static_dir = "static"
    os.makedirs(os.path.join(static_dir, "images"), exist_ok=True)
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    # Ensure an admin login is always stored in the database.
    @app.on_event("startup")
    def _seed_admin():
        from src.infrastructure.database.admin_seed import ensure_admin_seed
        try:
            ensure_admin_seed()
        except Exception as exc:  # don't block startup if seeding fails
            print(f"[admin-seed] skipped: {exc}")

    return app
