# HTE Compass Backend

Production-ready FastAPI backend for **HTE Compass**, an AI-powered administrative assistant that answers questions using Retrieval-Augmented Generation (RAG) over uploaded official PDF documents only.

## Features

- PDF upload, text extraction, and chunking
- Google Generative AI embeddings
- Local FAISS vector storage
- Gemini-powered grounded question answering
- Strict no-hallucination workflow when documents are missing or irrelevant
- CORS enabled for the React frontend
- Swagger/OpenAPI documentation

## Requirements

- Python 3.12+
- Google Gemini API key

## Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create your environment file:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

5. Set your Gemini API key in `.env`:

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_API_KEY` | Yes | — | Google Gemini API key |
| `UPLOADS_DIR` | No | `uploads` | Directory for uploaded PDF files |
| `VECTOR_DB_DIR` | No | `vector_db` | Directory for persisted FAISS index |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini chat model |
| `EMBEDDING_MODEL` | No | `models/text-embedding-004` | Google embedding model |
| `CHUNK_SIZE` | No | `1000` | Text chunk size for splitting |
| `CHUNK_OVERLAP` | No | `200` | Overlap between text chunks |
| `RETRIEVAL_TOP_K` | No | `4` | Number of chunks retrieved per question |
| `RELEVANCE_SCORE_THRESHOLD` | No | `0.5` | Minimum relevance score for retrieved chunks |
| `CORS_ORIGINS` | No | `http://localhost:5173`, `http://127.0.0.1:5173` | Allowed frontend origins |

## Running the Backend

From the `backend` directory with your virtual environment activated:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- API base URL: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health Check

`GET /health`

Response:

```json
{
  "status": "healthy"
}
```

### Upload PDF

`POST /upload`

Content-Type: `multipart/form-data`

Form field:

- `file`: PDF document

Success response:

```json
{
  "success": true,
  "message": "Document processed and indexed successfully.",
  "filename": "policy_document.pdf",
  "chunks_created": 42
}
```

### Chat

`POST /chat`

Request body:

```json
{
  "question": "What is the faculty recruitment policy?"
}
```

Success response:

```json
{
  "answer": "...",
  "source_document": "policy_document.pdf",
  "page_number": 3,
  "retrieved_context": "..."
}
```

If no relevant uploaded document content is found:

```json
{
  "answer": "No relevant information was found in the uploaded documents.",
  "source_document": null,
  "page_number": null,
  "retrieved_context": null
}
```

## Project Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── routes/
│   │   ├── upload.py
│   │   ├── chat.py
│   │   └── health.py
│   ├── services/
│   │   ├── pdf_service.py
│   │   ├── embedding_service.py
│   │   └── gemini_service.py
│   ├── rag/
│   │   ├── vector_store.py
│   │   └── retrieval.py
│   └── utils/
│       └── validators.py
├── uploads/
├── vector_db/
├── requirements.txt
├── .env.example
└── README.md
```

## RAG Workflow

1. Upload a PDF via `POST /upload`
2. Extract text with PyMuPDF
3. Split text into overlapping chunks with LangChain
4. Generate embeddings with Google Generative AI
5. Store vectors in a local FAISS index
6. Ask a question via `POST /chat`
7. Retrieve the most relevant chunks
8. Send retrieved context and the question to Gemini
9. Return an answer grounded only in uploaded documents

## Error Handling

The API returns appropriate HTTP status codes for:

- Missing `GOOGLE_API_KEY`
- Invalid or non-PDF uploads
- Empty or unreadable PDFs
- Embedding generation failures
- Missing or empty vector database
- Gemini API failures

## Notes

- Answers are generated only from uploaded official documents.
- No sample documents, fake analytics, or hardcoded AI responses are included.
- Upload at least one PDF before using the chat endpoint.
