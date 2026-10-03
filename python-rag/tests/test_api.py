import io
from fastapi.testclient import TestClient
from app import app
from config import settings

client = TestClient(app)
AUTH_HEADERS = {"X-Internal-Token": settings.INTERNAL_SERVICE_TOKEN}

def test_api_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["embedding_dim"] == 384
    assert "MiniLM" in data["embedding_model"]

def test_api_security_unauthorized_without_internal_token():
    # Calling protected endpoint without token should return 401
    resp = client.get("/documents?user_id=test-user")
    assert resp.status_code == 401

    # Calling protected endpoint with invalid token should return 401
    resp_invalid = client.get("/documents?user_id=test-user", headers={"X-Internal-Token": "wrong-token"})
    assert resp_invalid.status_code == 401

def test_api_security_path_traversal_rejected():
    # Calling protected endpoint with path traversal in user_id should return 400
    traversal_ids = ["../traversal", "../../etc/passwd", "user/evil", "user\\evil"]
    for bad_id in traversal_ids:
        resp = client.get(f"/documents?user_id={bad_id}", headers=AUTH_HEADERS)
        assert resp.status_code == 400
        assert "Invalid user_id" in resp.json()["detail"]

def test_api_document_lifecycle_and_rag():
    user_id = "test-api-user-1"

    # 1. Upload a document
    file_content = b"Java Virtual Machine allocates memory into Young Generation, Old Generation, and Metaspace."
    files = {"file": ("jvm_notes.txt", io.BytesIO(file_content), "text/plain")}
    data = {"user_id": user_id}

    upload_resp = client.post("/documents/upload", files=files, data=data, headers=AUTH_HEADERS)
    assert upload_resp.status_code == 201
    doc_data = upload_resp.json()
    doc_id = doc_data["document_id"]
    assert doc_data["filename"] == "jvm_notes.txt"
    assert doc_data["total_chunks"] >= 1

    # 2. List documents
    list_resp = client.get(f"/documents?user_id={user_id}", headers=AUTH_HEADERS)
    assert list_resp.status_code == 200
    docs = list_resp.json()["documents"]
    assert any(d["document_id"] == doc_id for d in docs)

    # 3. Query RAG
    query_payload = {
        "question": "How is JVM memory partitioned?",
        "user_id": user_id,
        "top_k": 2,
        "debug_mode": True
    }
    query_resp = client.post("/rag/query", json=query_payload, headers=AUTH_HEADERS)
    assert query_resp.status_code == 200
    rag_result = query_resp.json()
    assert rag_result["grounded"] is True
    assert len(rag_result["sources"]) > 0
    assert rag_result["sources"][0]["document"] == "jvm_notes.txt"

    # 4. Debug endpoint
    debug_resp = client.get(f"/rag/debug?user_id={user_id}&question=JVM memory", headers=AUTH_HEADERS)
    assert debug_resp.status_code == 200
    debug_data = debug_resp.json()
    assert debug_data["user_stats"]["total_documents"] >= 1

    # 5. Run evaluation benchmark
    eval_resp = client.post(f"/rag/evaluate?user_id={user_id}&top_k=2", headers=AUTH_HEADERS)
    assert eval_resp.status_code == 200
    eval_data = eval_resp.json()
    assert "mean_hit_rate_at_k" in eval_data
    assert "mean_reciprocal_rank_mrr" in eval_data
    assert "mean_precision_at_k" in eval_data
    assert "mean_recall_at_k" in eval_data

    # 6. Delete document
    del_resp = client.delete(f"/documents/{doc_id}?user_id={user_id}", headers=AUTH_HEADERS)
    assert del_resp.status_code == 200
    assert del_resp.json()["deleted"] is True

    # 7. Verify deletion in list
    list_resp2 = client.get(f"/documents?user_id={user_id}", headers=AUTH_HEADERS)
    assert list_resp2.status_code == 200
    assert len(list_resp2.json()["documents"]) == 0
