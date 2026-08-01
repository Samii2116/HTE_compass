from dataclasses import dataclass

from langchain_core.documents import Document

from app.config import Settings
from app.rag.vector_store import VectorStoreManager
from app.services.gemini_service import NO_RELEVANT_INFO_MESSAGE


@dataclass
class RetrievalResult:
    documents: list[Document]
    scores: list[float]
    context: str
    source_document: str | None
    page_number: int | None


def _format_context(documents: list[Document]) -> str:
    sections: list[str] = []
    for index, document in enumerate(documents, start=1):
        source = document.metadata.get("source_document", "unknown")
        page = document.metadata.get("page_number")
        page_label = f"Page {page}" if page is not None else "Page unknown"
        sections.append(
            f"[Chunk {index} | Source: {source} | {page_label}]\n{document.page_content}"
        )
    return "\n\n".join(sections)


def retrieve_relevant_documents(
    question: str,
    vector_store_manager: VectorStoreManager,
    settings: Settings,
) -> RetrievalResult | None:
    vector_store = vector_store_manager.require_vector_store()

    try:
        scored_results = vector_store.similarity_search_with_relevance_scores(
            question,
            k=settings.retrieval_top_k,
        )
        filtered_results = [
            (document, score)
            for document, score in scored_results
            if score >= settings.relevance_score_threshold
        ]
        if not filtered_results and scored_results:
            filtered_results = scored_results
    except Exception:
        docs = vector_store.similarity_search(question, k=settings.retrieval_top_k)
        filtered_results = [(doc, 1.0) for doc in docs]

    if not filtered_results:
        docs = vector_store.similarity_search(question, k=settings.retrieval_top_k)
        if docs:
            filtered_results = [(doc, 1.0) for doc in docs]
        else:
            return None

    documents = [document for document, _ in filtered_results]
    scores = [score for _, score in filtered_results]
    top_document = documents[0]

    source_document = top_document.metadata.get("source_document")
    page_number = top_document.metadata.get("page_number")

    return RetrievalResult(
        documents=documents,
        scores=scores,
        context=_format_context(documents),
        source_document=source_document,
        page_number=page_number,
    )


def build_no_result_response() -> dict:
    return {
        "answer": NO_RELEVANT_INFO_MESSAGE,
        "source_document": None,
        "page_number": None,
        "retrieved_context": None,
    }
