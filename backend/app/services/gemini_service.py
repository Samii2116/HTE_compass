from fastapi import HTTPException, status
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import Settings

NO_RELEVANT_INFO_MESSAGE = (
    "No relevant information was found in the uploaded documents."
)

SYSTEM_PROMPT = """You are HTE Compass, an AI administrative assistant for the Higher & Technical Education Department.

Answer the user's question using ONLY the provided context from official uploaded documents.

Rules:
- Use only facts present in the context.
- Do not use outside knowledge.
- Do not invent policies, numbers, names, or procedures.
- If the context does not contain enough information to answer the question, respond with exactly:
"No relevant information was found in the uploaded documents."
- Keep answers concise, professional, and suitable for government/educational administration."""

HUMAN_PROMPT = """Context from uploaded documents:
{context}

Question:
{question}

Answer:"""


class GeminiService:
    def __init__(self, settings: Settings):
        if not settings.google_api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GOOGLE_API_KEY is not configured.",
            )

        self._llm = ChatGoogleGenerativeAI(
            model=settings.gemini_model,
            google_api_key=settings.google_api_key,
            temperature=0.1,
        )
        self._prompt = ChatPromptTemplate.from_messages(
            [
                ("system", SYSTEM_PROMPT),
                ("human", HUMAN_PROMPT),
            ]
        )
        self._chain = self._prompt | self._llm

    def generate_answer(self, question: str, context: str) -> str:
        try:
            response = self._chain.invoke(
                {
                    "question": question,
                    "context": context,
                }
            )
            content = response.content if hasattr(response, "content") else str(response)
            return content.strip()
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Gemini API request failed: {exc}",
            ) from exc
