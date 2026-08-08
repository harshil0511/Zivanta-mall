"""Entry point — run with: uvicorn main:app --reload --port 8000"""
from src.api.main import create_app

app = create_app()
