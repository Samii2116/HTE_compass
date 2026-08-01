import logging
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.rag.vector_store import vector_store_manager
from app.services.embedding_service import EmbeddingService
from app.services.pdf_service import PDFProcessingError, process_pdf
from app.services.repository_service import repository_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Repository"])


class DocumentMetadata(BaseModel):
    id: str = Field(..., description="Unique ID / filename of document.")
    filename: str = Field(..., description="Filename of document.")
    title: str = Field(..., description="Document title.")
    category: str = Field(..., description="Category (Policy, Circulars, HR, etc.).")
    department: str = Field(..., description="Associated department.")
    language: str = Field(..., description="Document language (English, Marathi).")
    upload_date: str = Field(..., description="Upload / index date.")
    size_bytes: int = Field(..., description="File size in bytes.")
    size: str = Field(..., description="Human readable file size.")
    chunks_created: int = Field(..., description="Number of FAISS vector chunks created.")
    status: str = Field(..., description="Index status.")
    variant: str = Field(default="success", description="UI badge variant.")


class IndexRepositoryResponse(BaseModel):
    success: bool = Field(..., description="Whether bulk indexing succeeded.")
    message: str = Field(..., description="Status summary.")
    documents_indexed: int = Field(..., description="Number of documents indexed.")
    total_chunks: int = Field(..., description="Total FAISS chunks indexed.")


def get_embedding_service(settings: Settings = Depends(get_settings)) -> EmbeddingService:
    return EmbeddingService(settings)


@router.get(
    "/documents",
    response_model=List[DocumentMetadata],
    summary="Get all uploaded documents",
    description="Returns metadata for all authenticated Government documents in the repository.",
)
async def get_documents(
    settings: Settings = Depends(get_settings),
) -> List[Dict[str, Any]]:
    # Sync filesystem state with metadata store
    docs = repository_service.sync_uploads_directory(settings.uploads_dir)
    return docs


@router.post(
    "/repository/index",
    response_model=IndexRepositoryResponse,
    summary="Bulk index repository documents",
    description="Administrator action to scan uploads directory, extract text, generate embeddings, and populate FAISS.",
)
async def bulk_index_repository(
    settings: Settings = Depends(get_settings),
    embedding_service: EmbeddingService = Depends(get_embedding_service),
) -> IndexRepositoryResponse:
    target_dir = settings.uploads_dir if settings.uploads_dir.is_absolute() else (repository_service.BASE_DIR / settings.uploads_dir)
    pdf_files = list(target_dir.glob("*.pdf"))
    if not pdf_files:
        return IndexRepositoryResponse(
            success=True,
            message="No PDF documents found in uploads folder to index.",
            documents_indexed=0,
            total_chunks=0,
        )

    all_chunks = []
    indexed_count = 0

    vector_store_manager.initialize(settings, embedding_service.embeddings)

    for pdf_path in pdf_files:
        try:
            chunks = process_pdf(pdf_path, settings)
            if chunks:
                all_chunks.extend(chunks)
                stat = pdf_path.stat()
                repository_service.add_document(
                    filename=pdf_path.name,
                    size_bytes=stat.st_size,
                    chunks_created=len(chunks),
                )
                indexed_count += 1
        except PDFProcessingError as exc:
            logger.warning(f"Error processing {pdf_path.name}: {exc}")
        except Exception as exc:
            logger.error(f"Unexpected error processing {pdf_path.name}: {exc}")

    if all_chunks:
        vector_store_manager.add_documents(all_chunks)

    return IndexRepositoryResponse(
        success=True,
        message=f"Successfully indexed {indexed_count} documents into FAISS vector database.",
        documents_indexed=indexed_count,
        total_chunks=len(all_chunks),
    )


@router.get(
    "/stats",
    summary="Get repository statistics",
    description="Returns live repository metrics including document count, chunk count, queries count, and analytics distributions.",
)
async def get_stats(
    settings: Settings = Depends(get_settings),
) -> Dict[str, Any]:
    # Sync first to ensure fresh counts
    repository_service.sync_uploads_directory(settings.uploads_dir)
    return repository_service.get_stats()
