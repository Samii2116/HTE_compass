from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.rag.retrieval import build_no_result_response, retrieve_relevant_documents
from app.rag.vector_store import vector_store_manager
from app.services.gemini_service import GeminiService, NO_RELEVANT_INFO_MESSAGE
from app.services.embedding_service import EmbeddingService

from app.services.repository_service import repository_service

router = APIRouter(tags=["Chat"])


class ChatRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Administrative question to answer from uploaded documents.",
        examples=["What is the faculty recruitment policy?"],
    )
    language: str = Field(
        default="English",
        description="Preferred answer language (English, Marathi).",
    )


class ChatResponse(BaseModel):
    answer: str = Field(..., description="Answer grounded in retrieved document context.")
    source_document: str | None = Field(
        default=None,
        description="Primary source document used to generate the answer.",
    )
    page_number: int | None = Field(
        default=None,
        description="Page number from the primary source document, if available.",
    )
    retrieved_context: str | None = Field(
        default=None,
        description="Retrieved document context passed to the language model.",
    )


def get_embedding_service(settings: Settings = Depends(get_settings)) -> EmbeddingService:
    return EmbeddingService(settings)


def get_gemini_service(settings: Settings = Depends(get_settings)) -> GeminiService:
    return GeminiService(settings)


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Ask a question using RAG",
    description=(
        "Searches the FAISS vector database for relevant document chunks and uses Gemini "
        "to generate an answer grounded only in retrieved official documents."
    ),
    responses={
        200: {"description": "Chat response generated successfully."},
        404: {"description": "No documents have been uploaded yet."},
        502: {"description": "Gemini API or retrieval failure."},
    },
)
async def chat(
    payload: ChatRequest,
    settings: Settings = Depends(get_settings),
) -> ChatResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Question cannot be empty.",
        )

    language = payload.language or "English"

    try:
        embedding_service = EmbeddingService(settings)
        gemini_service = GeminiService(settings)
        vector_store_manager.initialize(settings, embedding_service.embeddings)
        retrieval = retrieve_relevant_documents(question, vector_store_manager, settings)
        
        if retrieval and retrieval.context:
            answer = gemini_service.generate_answer(question, retrieval.context)
            if answer.strip() != NO_RELEVANT_INFO_MESSAGE:
                repository_service.record_query(question, retrieval.source_document)
                return ChatResponse(
                    answer=answer,
                    source_document=retrieval.source_document,
                    page_number=retrieval.page_number,
                    retrieved_context=retrieval.context,
                )
            else:
                return ChatResponse(**build_no_result_response())
        
        return ChatResponse(**build_no_result_response())
    except Exception as exc:
        print("LIVE RAG FAILED:", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Live RAG failed: {exc}",
        )
