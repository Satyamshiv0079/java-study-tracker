import pytest
from services.vector_store import VectorStore
from services.embedding_service import EmbeddingService
from services.retriever import Retriever
from models.schemas import DocumentMetadata

@pytest.fixture
def isolated_setup(tmp_path):
    store = VectorStore(base_storage_dir=tmp_path)
    embed = EmbeddingService()
    retriever = Retriever(embedding_service=embed, vector_store=store)
    return store, embed, retriever

def test_tenant_data_isolation_strict(isolated_setup):
    store, embed, retriever = isolated_setup

    user_a = "candidate-alice-101"
    user_b = "candidate-bob-202"

    # User A uploads confidential document
    text_a = "Confidential Strategy: Project Apollo will deploy 500 Kubernetes microservices nodes in Frankfurt."
    emb_a = embed.encode([text_a], normalize=True)
    chunks_a = [{
        "chunk_id": "doc_a_c0",
        "text": text_a,
        "metadata": {"user_id": user_a, "document_id": "doc_a", "filename": "apollo_secret.pdf", "page": 1, "chunk_index": 0}
    }]
    meta_a = DocumentMetadata(
        user_id=user_a,
        document_id="doc_a",
        filename="apollo_secret.pdf",
        content_type="application/pdf",
        total_chunks=1,
        total_pages=1,
        uploaded_at="2026-09-29T10:00:00Z"
    )
    store.add_document(user_a, meta_a, chunks_a, emb_a)

    # User B uploads completely different document
    text_b = "Beginner Java Tutorial: How to declare variables and loops in Java 21."
    emb_b = embed.encode([text_b], normalize=True)
    chunks_b = [{
        "chunk_id": "doc_b_c0",
        "text": text_b,
        "metadata": {"user_id": user_b, "document_id": "doc_b", "filename": "java_basics.txt", "page": 1, "chunk_index": 0}
    }]
    meta_b = DocumentMetadata(
        user_id=user_b,
        document_id="doc_b",
        filename="java_basics.txt",
        content_type="text/plain",
        total_chunks=1,
        total_pages=1,
        uploaded_at="2026-09-29T10:05:00Z"
    )
    store.add_document(user_b, meta_b, chunks_b, emb_b)

    # Test 1: User A queries their own document
    citations_a = retriever.retrieve(user_id=user_a, question="What is Project Apollo deployment plan?")
    assert len(citations_a) > 0
    assert citations_a[0].document == "apollo_secret.pdf"
    assert "Kubernetes" in citations_a[0].snippet

    # Test 2: User B queries for User A's document content -> MUST RETURN ZERO RESULTS
    citations_b_leak_attempt = retriever.retrieve(user_id=user_b, question="What is Project Apollo deployment plan?")
    assert len(citations_b_leak_attempt) == 0, "CRITICAL SECURITY LEAK: User B retrieved User A's confidential document!"

    # Test 3: User A queries for User B's document content -> MUST RETURN ZERO RESULTS
    citations_a_leak_attempt = retriever.retrieve(user_id=user_a, question="How to declare variables in Java 21?")
    assert len(citations_a_leak_attempt) == 0, "CRITICAL SECURITY LEAK: User A retrieved User B's document!"

    # Test 4: Document listing is also isolated
    docs_a = store.list_documents(user_a)
    docs_b = store.list_documents(user_b)
    assert len(docs_a) == 1 and docs_a[0].filename == "apollo_secret.pdf"
    assert len(docs_b) == 1 and docs_b[0].filename == "java_basics.txt"
