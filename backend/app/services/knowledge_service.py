import json
import logging
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
KNOWLEDGE_BASE_PATH = BASE_DIR / "data" / "knowledge_base.json"

NO_INFO_EN = "No relevant information was found in the uploaded documents."
NO_INFO_MR = "मागणीनुसार कोणतीही माहिती अपलोड केलेल्या दस्तऐवजात आढळली नाही."


class KnowledgeService:
    def __init__(self, kb_path: Path = KNOWLEDGE_BASE_PATH):
        self.kb_path = kb_path
        self._cache: Optional[List[Dict[str, Any]]] = None

    def _load_data(self) -> List[Dict[str, Any]]:
        if self._cache is not None:
            return self._cache

        if not self.kb_path.exists():
            logger.warning(f"Knowledge base file not found: {self.kb_path}")
            self._cache = []
            return self._cache

        try:
            with self.kb_path.open("r", encoding="utf-8") as f:
                self._cache = json.load(f)
                print(f"Knowledge Base Loaded: {len(self._cache)} entries")
                return self._cache
        except Exception as exc:
            logger.error(f"Failed to load knowledge base: {exc}")
            self._cache = []
            return self._cache

    def _normalize(self, text: str) -> str:
        text = text.lower()
        text = text.replace("_", " ")
        text = text.replace("-", " ")
        text = re.sub(r"[^\w\s]", "", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def query(self, question: str, language: str = "English") -> Dict[str, Any]:

        data = self._load_data()

        q = self._normalize(question)

        print("Normalized Question:", q)

        if not q or not data:
            return {
                "answer": NO_INFO_MR if language.lower() == "marathi" else NO_INFO_EN,
                "source_document": None,
                "page_number": None,
                "retrieved_context": None,
            }

        best_match = None
        best_score = -1

        question_words = set(q.split())

        for item in data:

            score = 0

            for keyword in item.get("keywords", []):

                kw = self._normalize(keyword)

                # Exact keyword
                if kw == q:
                    score += 100

                # Phrase match
                elif kw in q:
                    score += 60

                elif q in kw:
                    score += 40

                # Word overlap
                kw_words = set(kw.split())

                common = question_words.intersection(kw_words)

                score += len(common) * 20

            # Search inside answers too

            english = self._normalize(item.get("english_answer", ""))
            marathi = self._normalize(item.get("marathi_answer", ""))

            for word in question_words:

                if len(word) <= 2:
                    continue

                if word in english:
                    score += 5

                if word in marathi:
                    score += 5

            if score > best_score:
                best_score = score
                best_match = item

        print("Best Score:", best_score)

        if best_match and best_score > 0:

            if language.lower() in ["marathi", "mr"]:

                answer = best_match.get("marathi_answer")

                if not answer:
                    answer = best_match.get("english_answer")

            else:

                answer = best_match.get("english_answer")

            print("Matched Document:", best_match.get("source_document"))

            return {
                "answer": answer,
                "source_document": best_match.get("source_document"),
                "page_number": best_match.get("page_number", 1),
                "retrieved_context": best_match.get("retrieved_context"),
            }

        return {
            "answer": NO_INFO_MR if language.lower() in ["marathi", "mr"] else NO_INFO_EN,
            "source_document": None,
            "page_number": None,
            "retrieved_context": None,
        }


knowledge_service = KnowledgeService()