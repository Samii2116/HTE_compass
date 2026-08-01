import json
import os
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.config import Settings


BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_META_PATH = BASE_DIR / "data" / "repository_meta.json"


def _format_size(size_bytes: int) -> str:
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"


def _infer_metadata(filename: str) -> Dict[str, str]:
    lower = filename.lower()
    
    # Category inference
    if any(k in lower for k in ["policy", "guidelines", "norm", "framework"]):
        category = "Policy"
    elif any(k in lower for k in ["calender", "calendar", "schedule", "academic"]):
        category = "Academic"
    elif any(k in lower for k in ["syllabus", "curriculum", "sem"]):
        category = "Regulations"
    elif any(k in lower for k in ["circular", "notice", "meeting"]):
        category = "Circulars"
    elif any(k in lower for k in ["budget", "finance", "allocation"]):
        category = "Finance"
    else:
        category = "General"

    # Department inference
    if any(k in lower for k in ["engineering", "tech", "it"]):
        department = "Technical Education"
    elif any(k in lower for k in ["recruitment", "staff", "faculty", "hr"]):
        department = "Higher Education"
    else:
        department = "Administrative"

    # Language inference
    if any(k in lower for k in ["marathi", "_mr", "gr_"]):
        language = "Marathi"
    else:
        language = "English"

    # Clean title
    title = filename.replace("_", " ").replace("-", " ")
    if title.lower().endswith(".pdf"):
        title = title[:-4]

    return {
        "title": title.strip().title(),
        "category": category,
        "department": department,
        "language": language,
    }


class RepositoryService:
    def __init__(self, meta_path: Path = DEFAULT_META_PATH):
        self.meta_path = meta_path
        self.meta_path.parent.mkdir(parents=True, exist_ok=True)
        self._ensure_meta_exists()

    def _ensure_meta_exists(self) -> None:
        if not self.meta_path.exists():
            initial_data = {
                "documents": {},
                "stats": {
                    "total_documents": 0,
                    "total_chunks": 0,
                    "total_queries": 0,
                    "last_indexed_time": None,
                    "index_status": "Healthy",
                },
                "recent_activity": [],
                "top_queries": {},
            }
            self._save(initial_data)

    def _load(self) -> Dict[str, Any]:
        try:
            with self.meta_path.open("r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {
                "documents": {},
                "stats": {
                    "total_documents": 0,
                    "total_chunks": 0,
                    "total_queries": 0,
                    "last_indexed_time": None,
                    "index_status": "Healthy",
                },
                "recent_activity": [],
                "top_queries": {},
            }

    def _save(self, data: Dict[str, Any]) -> None:
        with self.meta_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def sync_uploads_directory(self, uploads_dir: Path) -> List[Dict[str, Any]]:
        """Scans uploads directory for existing PDFs and registers them if not present."""
        data = self._load()
        documents = data.setdefault("documents", {})
        
        target_dir = uploads_dir if uploads_dir.is_absolute() else (BASE_DIR / uploads_dir)

        if not target_dir.exists():
            return list(documents.values())

        updated = False
        pdf_files = list(target_dir.glob("*.pdf"))

        for pdf_path in pdf_files:
            filename = pdf_path.name
            if filename not in documents:
                stat = pdf_path.stat()
                inferred = _infer_metadata(filename)
                mod_time = datetime.fromtimestamp(stat.st_mtime).strftime("%b %d, %Y")
                
                doc_meta = {
                    "id": filename,
                    "filename": filename,
                    "title": inferred["title"],
                    "category": inferred["category"],
                    "department": inferred["department"],
                    "language": inferred["language"],
                    "upload_date": mod_time,
                    "size_bytes": stat.st_size,
                    "size": _format_size(stat.st_size),
                    "chunks_created": 12,  # Default chunk estimate until full re-index
                    "status": "Indexed",
                    "variant": "success",
                }
                documents[filename] = doc_meta
                updated = True

        if updated:
            data["stats"]["total_documents"] = len(documents)
            data["stats"]["total_chunks"] = sum(d.get("chunks_created", 0) for d in documents.values())
            data["stats"]["last_indexed_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self._save(data)

        return list(documents.values())

    def add_document(
        self,
        filename: str,
        size_bytes: int,
        chunks_created: int,
        category: Optional[str] = None,
        department: Optional[str] = None,
        language: Optional[str] = None,
    ) -> Dict[str, Any]:
        data = self._load()
        documents = data.setdefault("documents", {})
        
        inferred = _infer_metadata(filename)
        now_str = datetime.now().strftime("%b %d, %Y")

        doc_meta = {
            "id": filename,
            "filename": filename,
            "title": inferred["title"],
            "category": category or inferred["category"],
            "department": department or inferred["department"],
            "language": language or inferred["language"],
            "upload_date": now_str,
            "size_bytes": size_bytes,
            "size": _format_size(size_bytes),
            "chunks_created": chunks_created,
            "status": "Indexed",
            "variant": "success",
        }

        documents[filename] = doc_meta
        data["stats"]["total_documents"] = len(documents)
        data["stats"]["total_chunks"] = sum(d.get("chunks_created", 0) for d in documents.values())
        data["stats"]["last_indexed_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Record activity
        activities = data.setdefault("recent_activity", [])
        activities.insert(
            0,
            {
                "title": "Document uploaded & indexed",
                "description": f"{filename} ({_format_size(size_bytes)}, {chunks_created} chunks)",
                "time": "Just now",
                "badge": "Upload",
                "variant": "blue",
            },
        )
        data["recent_activity"] = activities[:20]

        self._save(data)
        return doc_meta

    def record_query(self, question: str, source_doc: Optional[str] = None) -> None:
        data = self._load()
        stats = data.setdefault("stats", {})
        stats["total_queries"] = stats.get("total_queries", 0) + 1

        top_queries = data.setdefault("top_queries", {})
        top_queries[question] = top_queries.get(question, 0) + 1

        activities = data.setdefault("recent_activity", [])
        activities.insert(
            0,
            {
                "title": "AI Query resolved",
                "description": f"Query: \"{question[:60]}{'...' if len(question)>60 else ''}\"",
                "time": "Just now",
                "badge": "Assistant",
                "variant": "purple",
            },
        )
        data["recent_activity"] = activities[:20]
        self._save(data)

    def get_all_documents(self) -> List[Dict[str, Any]]:
        data = self._load()
        return list(data.get("documents", {}).values())

    def get_stats(self) -> Dict[str, Any]:
        data = self._load()
        docs = list(data.get("documents", {}).values())
        stats = data.get("stats", {})

        # Compute category distribution
        category_dist: Dict[str, int] = {}
        language_dist: Dict[str, int] = {}
        department_dist: Dict[str, int] = {}

        for doc in docs:
            cat = doc.get("category", "General")
            category_dist[cat] = category_dist.get(cat, 0) + 1
            
            lang = doc.get("language", "English")
            language_dist[lang] = language_dist.get(lang, 0) + 1

            dept = doc.get("department", "Administrative")
            department_dist[dept] = department_dist.get(dept, 0) + 1

        # Sorted top queries
        top_queries_raw = data.get("top_queries", {})
        sorted_top_queries = [
            {"query": q, "count": cnt}
            for q, cnt in sorted(top_queries_raw.items(), key=lambda item: item[1], reverse=True)[:5]
        ]

        last_doc = docs[-1] if docs else None

        return {
            "total_documents": len(docs),
            "total_chunks": sum(d.get("chunks_created", 0) for d in docs),
            "total_queries": stats.get("total_queries", 0),
            "last_uploaded_document": last_doc,
            "index_status": stats.get("index_status", "Healthy"),
            "last_indexed_time": stats.get("last_indexed_time"),
            "category_distribution": category_dist,
            "language_distribution": language_dist,
            "department_distribution": department_dist,
            "recent_activity": data.get("recent_activity", [])[:10],
            "top_queries": sorted_top_queries,
        }


repository_service = RepositoryService()
