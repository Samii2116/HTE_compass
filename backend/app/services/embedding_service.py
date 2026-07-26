from fastapi import HTTPException, status
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config import Settings


class EmbeddingService:
    def __init__(self, settings: Settings):
        if not settings.google_api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GOOGLE_API_KEY is not configured.",
            )

        self._settings = settings
        self._embeddings = GoogleGenerativeAIEmbeddings(
            model=settings.embedding_model,
            google_api_key=settings.google_api_key,
        )

    @property
    def embeddings(self) -> GoogleGenerativeAIEmbeddings:
        return self._embeddings

    def embed_query(self, text: str) -> list[float]:
        try:
            return self._embeddings.embed_query(text)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to generate embeddings: {exc}",
            ) from exc
