from typing import List, Tuple, Dict, Any, Optional
from models.schemas import SourceCitation
from services.embedding_service import EmbeddingService
from services.vector_store import VectorStore
from config import settings

class Retriever:
    """
    Retrieval coordinator: embeds queries, searches user-isolated FAISS indexes,
    applies similarity thresholding, and structures source citations.
    """

    def __init__(self, embedding_service: Optional[EmbeddingService] = None, vector_store: Optional[VectorStore] = None):
        self.embedding_service = embedding_service or EmbeddingService()
        self.vector_store = vector_store or VectorStore()

    def retrieve(
        self,
        user_id: str,
        question: str,
        top_k: Optional[int] = None,
        threshold: Optional[float] = None
    ) -> List[SourceCitation]:
        """
        Retrieves top_k chunks matching the question for the specified user_id.
        """
        k = top_k or settings.TOP_K
        min_threshold = threshold if threshold is not None else settings.SIMILARITY_THRESHOLD

        # 1. Encode question to normalized vector
        query_vector = self.embedding_service.encode_query(question)

        # 2. Search FAISS index for this user
        matches = self.vector_store.search(user_id=user_id, query_embedding=query_vector, top_k=k)

        # 3. Filter by similarity threshold & format citations
        citations: List[SourceCitation] = []
        for chunk, score in matches:
            if score >= min_threshold:
                meta = chunk.get("metadata", {})
                snippet = chunk.get("text", "")
                if len(snippet) > 280:
                    snippet = snippet[:280] + "..."

                citations.append(
                    SourceCitation(
                        document=meta.get("filename", "unknown"),
                        document_id=meta.get("document_id", ""),
                        page=meta.get("page", 1),
                        chunk_index=meta.get("chunk_index", 0),
                        score=round(float(score), 4),
                        snippet=snippet
                    )
                )

        return citations
