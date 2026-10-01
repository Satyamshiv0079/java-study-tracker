import json
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
import faiss

from config import settings
from models.schemas import DocumentMetadata

class VectorStore:
    """
    Manages tenant-isolated FAISS vector indexes.
    Each user has their own independent FAISS index and chunk metadata stored under:
    settings.USERS_STORAGE_DIR / user_id /
    """

    def __init__(self, base_storage_dir: Optional[Path] = None):
        self.base_dir = base_storage_dir or settings.USERS_STORAGE_DIR
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self.dimension = settings.EMBEDDING_DIMENSION

    def _get_user_dir(self, user_id: str) -> Path:
        # Sanitize user_id to prevent directory traversal
        safe_user_id = "".join(c for c in user_id if c.isalnum() or c in ("-", "_")).strip()
        if not safe_user_id:
            safe_user_id = "default"
        user_dir = self.base_dir / safe_user_id
        user_dir.mkdir(parents=True, exist_ok=True)
        return user_dir

    def _index_path(self, user_id: str) -> Path:
        return self._get_user_dir(user_id) / "index.faiss"

    def _chunks_path(self, user_id: str) -> Path:
        return self._get_user_dir(user_id) / "chunks.json"

    def _docs_path(self, user_id: str) -> Path:
        return self._get_user_dir(user_id) / "documents.json"

    def _load_index(self, user_id: str) -> faiss.IndexFlatIP:
        path = self._index_path(user_id)
        if path.exists():
            return faiss.read_index(str(path))
        return faiss.IndexFlatIP(self.dimension)

    def _save_index(self, user_id: str, index: faiss.IndexFlatIP):
        faiss.write_index(index, str(self._index_path(user_id)))

    def _load_chunks(self, user_id: str) -> List[Dict[str, Any]]:
        path = self._chunks_path(user_id)
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def _save_chunks(self, user_id: str, chunks: List[Dict[str, Any]]):
        with open(self._chunks_path(user_id), "w", encoding="utf-8") as f:
            json.dump(chunks, f, indent=2, ensure_ascii=False)

    def _load_documents(self, user_id: str) -> List[Dict[str, Any]]:
        path = self._docs_path(user_id)
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def _save_documents(self, user_id: str, docs: List[Dict[str, Any]]):
        with open(self._docs_path(user_id), "w", encoding="utf-8") as f:
            json.dump(docs, f, indent=2, ensure_ascii=False)

    def add_document(
        self,
        user_id: str,
        document_metadata: DocumentMetadata,
        chunks: List[Dict[str, Any]],
        embeddings: np.ndarray
    ) -> None:
        """
        Appends chunks and embeddings to the user's isolated FAISS index and metadata store.
        """
        if len(chunks) == 0:
            return

        index = self._load_index(user_id)
        existing_chunks = self._load_chunks(user_id)
        existing_docs = self._load_documents(user_id)

        # Add vectors to FAISS
        index.add(embeddings)
        self._save_index(user_id, index)

        # Append chunks
        existing_chunks.extend(chunks)
        self._save_chunks(user_id, existing_chunks)

        # Append document metadata
        existing_docs.append(document_metadata.model_dump())
        self._save_documents(user_id, existing_docs)

    def search(
        self,
        user_id: str,
        query_embedding: np.ndarray,
        top_k: int = 4
    ) -> List[Tuple[Dict[str, Any], float]]:
        """
        Searches ONLY the specified user's FAISS index.
        Returns list of tuples: (chunk_dict, cosine_similarity_score).
        """
        index = self._load_index(user_id)
        if index.ntotal == 0:
            return []

        chunks = self._load_chunks(user_id)
        if not chunks:
            return []

        actual_k = min(top_k, index.ntotal)
        scores, indices = index.search(query_embedding, actual_k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx != -1 and idx < len(chunks):
                results.append((chunks[idx], float(score)))

        return results

    def delete_document(self, user_id: str, document_id: str, embedding_service=None) -> bool:
        """
        Deletes a document and its chunks from the user's isolated store.
        Rebuilds the user's FAISS index with the remaining chunks.
        """
        existing_docs = self._load_documents(user_id)
        matching_docs = [d for d in existing_docs if d["document_id"] == document_id]
        if not matching_docs:
            return False

        remaining_docs = [d for d in existing_docs if d["document_id"] != document_id]
        existing_chunks = self._load_chunks(user_id)
        remaining_chunks = [c for c in existing_chunks if c.get("metadata", {}).get("document_id") != document_id]

        # Rebuild index
        new_index = faiss.IndexFlatIP(self.dimension)
        if remaining_chunks:
            if embedding_service is None:
                from services.embedding_service import EmbeddingService
                embedding_service = EmbeddingService()
            texts = [c["text"] for c in remaining_chunks]
            new_embeddings = embedding_service.encode(texts, normalize=True)
            new_index.add(new_embeddings)

        self._save_index(user_id, new_index)
        self._save_chunks(user_id, remaining_chunks)
        self._save_documents(user_id, remaining_docs)
        return True

    def list_documents(self, user_id: str) -> List[DocumentMetadata]:
        docs = self._load_documents(user_id)
        return [DocumentMetadata(**d) for d in docs]

    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        index = self._load_index(user_id)
        docs = self._load_documents(user_id)
        return {
            "user_id": user_id,
            "total_documents": len(docs),
            "total_vectors": index.ntotal
        }
