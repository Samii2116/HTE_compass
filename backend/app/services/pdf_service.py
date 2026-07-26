from pathlib import Path

import fitz
from fastapi import HTTPException, status
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import Settings


class PDFProcessingError(Exception):
    pass


def extract_text_from_pdf(file_path: Path) -> list[Document]:
    try:
        pdf_document = fitz.open(file_path)
    except Exception as exc:
        raise PDFProcessingError("Invalid or corrupted PDF file.") from exc

    try:
        page_documents: list[Document] = []

        for page_index in range(pdf_document.page_count):
            page = pdf_document.load_page(page_index)
            text = page.get_text("text").strip()
            if not text:
                continue

            page_documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "source_document": file_path.name,
                        "page_number": page_index + 1,
                    },
                )
            )

        if not page_documents:
            raise PDFProcessingError("PDF contains no extractable text.")

        return page_documents
    finally:
        pdf_document.close()


def split_documents(documents: list[Document], settings: Settings) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        length_function=len,
    )
    return splitter.split_documents(documents)


def process_pdf(file_path: Path, settings: Settings) -> list[Document]:
    page_documents = extract_text_from_pdf(file_path)
    return split_documents(page_documents, settings)


def handle_pdf_error(error: PDFProcessingError) -> HTTPException:
    message = str(error)
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY

    if "no extractable text" in message.lower():
        status_code = status.HTTP_422_UNPROCESSABLE_ENTITY

    return HTTPException(status_code=status_code, detail=message)
