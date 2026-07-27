from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    google_api_key: str = Field(..., description="Google Gemini API key")

    uploads_dir: Path = Path("uploads")
    vector_db_dir: Path = Path("vector_db")

    chunk_size: int = 1000
    chunk_overlap: int = 200
    retrieval_top_k: int = 4
    relevance_score_threshold: float = 0.5

    gemini_model: str = "gemini-2.0-flash"
    embedding_model: str = "models/text-embedding-004"

    cors_origins: list[str] = Field(
    default_factory=lambda: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]
)

    app_title: str = "HTE Compass API"
    app_description: str = (
        "AI-powered administrative assistant backend using RAG over official documents."
    )
    app_version: str = "1.0.0"


@lru_cache
def get_settings() -> Settings:
    return Settings()


def ensure_directories(settings: Settings) -> None:
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    settings.vector_db_dir.mkdir(parents=True, exist_ok=True)
