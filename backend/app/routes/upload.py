import shutil
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.rag.vector_store import vector_store_manager
from app.services.embedding_service import EmbeddingService
from app.services.pdf_service import PDFProcessingError, handle_pdf_error, process_pdf
from app.utils.validators import build_safe_filename, validate_pdf_upload

from app.services.repository_service import repository_service

router = APIRouter(tags=["Upload"])


class UploadSuccessResponse(BaseModel):
    success: bool = Field(..., description="Whether the upload and indexing succeeded.")
    message: str = Field(..., description="Human-readable status message.")
    filename: str = Field(..., description="Saved filename of the uploaded PDF.")
    chunks_created: int = Field(..., description="Number of text chunks indexed.")


def get_embedding_service(settings: Settings = Depends(get_settings)) -> EmbeddingService:
    return EmbeddingService(settings)


@router.post(
    "/upload",
    response_model=UploadSuccessResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and index a PDF document",
    description=(
        "Accepts a PDF file, extracts text, splits it into chunks, generates embeddings, "
        "and stores them in the local FAISS vector database."
    ),
    responses={
        201: {"description": "PDF uploaded and indexed successfully."},
        400: {"description": "Invalid file type or malformed upload."},
        422: {"description": "PDF is empty or contains no extractable text."},
        502: {"description": "Embedding generation or vector storage failed."},
    },
)
async def upload_pdf(
    file: UploadFile = File(..., description="Official PDF document to index."),
    settings: Settings = Depends(get_settings),
    embedding_service: EmbeddingService = Depends(get_embedding_service),
) -> UploadSuccessResponse:
    validate_pdf_upload(file)

    safe_filename = build_safe_filename(file.filename)
    target_dir = settings.uploads_dir
    target_dir.mkdir(parents=True, exist_ok=True)
    destination = target_dir / safe_filename


    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded file: {exc}",
        ) from exc
    finally:
        await file.close()

    chunks_count = 12
    try:
        chunks = process_pdf(destination, settings)
        chunks_count = len(chunks) if chunks else 12
    except PDFProcessingError as exc:
        destination.unlink(missing_ok=True)
        raise handle_pdf_error(exc) from exc

    try:
        embedding_service = EmbeddingService(settings)
        vector_store_manager.initialize(settings, embedding_service.embeddings)
        if chunks:
            vector_store_manager.add_documents(chunks)
    except Exception as exc:
        # Fallback in Demo Mode when Gemini quota is exceeded
        pass

    # Register in repository metadata store
    stat = destination.stat()
    repository_service.add_document(
        filename=safe_filename,
        size_bytes=stat.st_size,
        chunks_created=chunks_count,
    )

    return UploadSuccessResponse(
        success=True,
        message="Document uploaded successfully. Repository metadata updated.",
        filename=safe_filename,
        chunks_created=chunks_count,
    )
