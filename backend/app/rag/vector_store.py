from pathlib import Path

from fastapi import HTTPException, status
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config import Settings


class VectorStoreManager:
    def __init__(self) -> None:
        self._vector_store: FAISS | None = None
        self._settings: Settings | None = None
        self._embeddings: GoogleGenerativeAIEmbeddings | None = None

    @property
    def is_loaded(self) -> bool:
        return self._vector_store is not None

    @property
    def vector_store(self) -> FAISS | None:
        return self._vector_store

    def initialize(self, settings: Settings, embeddings: GoogleGenerativeAIEmbeddings) -> None:
        self._settings = settings
        self._embeddings = embeddings
        self.load()

    def _index_path(self) -> Path:
        if not self._settings:
            raise RuntimeError("Vector store manager is not initialized.")
        return self._settings.vector_db_dir

    def load(self) -> None:
        if not self._settings or not self._embeddings:
            raise RuntimeError("Vector store manager is not initialized.")

        index_path = self._index_path()
        index_file = index_path / "index.faiss"
        docstore_file = index_path / "index.pkl"

        if index_file.exists() and docstore_file.exists():
            try:
                self._vector_store = FAISS.load_local(
                    str(index_path),
                    self._embeddings,
                    allow_dangerous_deserialization=True,
                )
            except Exception as exc:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to load vector database: {exc}",
                ) from exc
        else:
            self._vector_store = None

    def add_documents(self, documents: list[Document]) -> None:
        if not self._settings or not self._embeddings:
            raise RuntimeError("Vector store manager is not initialized.")

        if not documents:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="No document chunks were generated from the uploaded PDF.",
            )

        try:
            if self._vector_store is None:
                self._vector_store = FAISS.from_documents(documents, self._embeddings)
            else:
                self._vector_store.add_documents(documents)
            self.save()
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to store embeddings in vector database: {exc}",
            ) from exc

    def save(self) -> None:
        if not self._settings or self._vector_store is None:
            return

        try:
            self._vector_store.save_local(str(self._index_path()))
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to persist vector database: {exc}",
            ) from exc

    def require_vector_store(self) -> FAISS:
        if self._vector_store is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Vector database is empty. Upload at least one PDF document before chatting."
                ),
            )
        return self._vector_store


vector_store_manager = VectorStoreManager()
