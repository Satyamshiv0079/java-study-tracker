import pytest
import shutil
from pathlib import Path
from services.vector_store import VectorStore
from services.embedding_service import EmbeddingService
from models.schemas import DocumentMetadata

@pytest.fixture
def temp_store(tmp_path):
    return VectorStore(base_storage_dir=tmp_path)

def test_vector_store_crud(temp_store):
    embedding_service = EmbeddingService()
    user_id = "test-user-99"

    texts = [
        "PostgreSQL database query optimization using B-tree indexes.",
        "Spring Data JPA repositories with derived query methods."
    ]
    embeddings = embedding_service.encode(texts, normalize=True)

    chunks = [
        {
            "chunk_id": "doc1_c0",
            "text": texts[0],
            "metadata": {"user_id": user_id, "document_id": "doc1", "filename": "db.txt", "page": 1, "chunk_index": 0}
        },
        {
            "chunk_id": "doc1_c1",
            "text": texts[1],
            "metadata": {"user_id": user_id, "document_id": "doc1", "filename": "db.txt", "page": 1, "chunk_index": 1}
        }
    ]

    doc_meta = DocumentMetadata(
        user_id=user_id,
        document_id="doc1",
        filename="db.txt",
        content_type="text/plain",
        total_chunks=2,
        total_pages=1,
        uploaded_at="2026-09-29T00:00:00Z"
    )

    temp_store.add_document(user_id, doc_meta, chunks, embeddings)

    # Search
    query_vec = embedding_service.encode_query("database indexing")
    results = temp_store.search(user_id, query_vec, top_k=2)

    assert len(results) == 2
    top_chunk, score = results[0]
    assert "PostgreSQL" in top_chunk["text"]
    assert score > 0.40

    # Delete
    deleted = temp_store.delete_document(user_id, "doc1", embedding_service)
    assert deleted is True

    # Search after delete
    results_after = temp_store.search(user_id, query_vec, top_k=2)
    assert len(results_after) == 0
