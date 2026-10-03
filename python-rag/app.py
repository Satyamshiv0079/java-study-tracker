import re
import uuid
from datetime import datetime, timezone
from typing import Optional
import faiss
from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException, status, Security, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader

from config import settings
from models.schemas import (
    HealthResponse,
    DocumentMetadata,
    DocumentListResponse,
    DeleteResponse,
    QueryRequest,
    QueryResponse,
)
from services.document_processor import DocumentProcessor
from services.chunker import Chunker
from services.embedding_service import EmbeddingService
from services.vector_store import VectorStore
from services.retriever import Retriever
from services.llm_service import LLMService
from services.evaluation import EvaluationHarness

app = FastAPI(
    title="CodeMentor Enterprise GenAI RAG Service",
    description="Production-grade, tenant-isolated Retrieval-Augmented Generation service powered by Sentence-Transformers, FAISS, and Gemini LLM.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Internal Service Token Security
api_key_header = APIKeyHeader(name="X-Internal-Token", auto_error=False)

def verify_internal_token(token: Optional[str] = Security(api_key_header)):
    expected = settings.INTERNAL_SERVICE_TOKEN
    if expected and token != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid or missing internal service token (X-Internal-Token)."
        )

USER_ID_REGEX = re.compile(r"^[a-zA-Z0-9_\-]+$")

def sanitize_user_id(user_id: str) -> str:
    if not user_id or not USER_ID_REGEX.match(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id: Only alphanumeric characters, hyphens, and underscores are permitted to prevent path traversal."
        )
    return user_id

# Initialize service singletons
embedding_service = EmbeddingService()
vector_store = VectorStore()
chunker = Chunker()
retriever = Retriever(embedding_service=embedding_service, vector_store=vector_store)
llm_service = LLMService()
evaluation_harness = EvaluationHarness(retriever=retriever)

@app.get("/health", response_model=HealthResponse, tags=["System"])
def health_check():
    """
    Returns the real-time operational status, FAISS version, and active embedding model.
    """
    return HealthResponse(
        status="healthy",
        service="CodeMentor Enterprise GenAI RAG Service",
        faiss_version=getattr(faiss, "__version__", "1.15.1"),
        embedding_model=settings.EMBEDDING_MODEL_NAME,
        embedding_dim=settings.EMBEDDING_DIMENSION
    )

@app.post("/documents/upload", response_model=DocumentMetadata, status_code=status.HTTP_201_CREATED, tags=["Knowledge Base"], dependencies=[Security(verify_internal_token)])
async def upload_document(
    file: UploadFile = File(..., description="Document file (.pdf, .docx, .txt, .md)"),
    user_id: str = Form(..., description="Authenticated tenant/user ID for isolated storage")
):
    """
    Uploads, parses, chunks, embeds, and indexes a technical document in the user's isolated FAISS index.
    """
    user_id = sanitize_user_id(user_id)

    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    if not DocumentProcessor.is_supported(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Supported extensions: {list(DocumentProcessor.SUPPORTED_EXTENSIONS)}"
        )

    MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB
    content_bytes = await file.read()
    if len(content_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(content_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum upload limit of 10MB (received {len(content_bytes)} bytes)."
        )

    # 1. Extract text and pages
    try:
        pages = DocumentProcessor.process_file(file.filename, content_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

    document_id = str(uuid.uuid4())

    # 2. Chunk pages
    chunks = chunker.chunk_document(
        pages=pages,
        user_id=user_id,
        document_id=document_id,
        filename=file.filename
    )

    if not chunks:
        raise HTTPException(status_code=400, detail="Document produced 0 readable text chunks.")

    # 3. Generate dense embeddings with L2 normalization
    texts = [c["text"] for c in chunks]
    embeddings = embedding_service.encode(texts, normalize=True)

    # 4. Create document metadata
    doc_metadata = DocumentMetadata(
        user_id=user_id,
        document_id=document_id,
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream",
        total_chunks=len(chunks),
        total_pages=len(pages),
        uploaded_at=datetime.now(timezone.utc).isoformat()
    )

    # 5. Store in user-isolated FAISS partition
    vector_store.add_document(
        user_id=user_id,
        document_metadata=doc_metadata,
        chunks=chunks,
        embeddings=embeddings
    )

    return doc_metadata

@app.get("/documents", response_model=DocumentListResponse, tags=["Knowledge Base"], dependencies=[Security(verify_internal_token)])
def list_documents(user_id: str = Query(..., description="Tenant/User ID")):
    """
    Lists all indexed documents belonging strictly to the requested user.
    """
    user_id = sanitize_user_id(user_id)
    docs = vector_store.list_documents(user_id=user_id)
    return DocumentListResponse(user_id=user_id, documents=docs)

@app.delete("/documents/{document_id}", response_model=DeleteResponse, tags=["Knowledge Base"], dependencies=[Security(verify_internal_token)])
def delete_document(
    document_id: str,
    user_id: str = Query(..., description="Tenant/User ID")
):
    """
    Deletes a document and its chunks from the user's isolated store and rebuilds their FAISS index.
    """
    user_id = sanitize_user_id(user_id)
    success = vector_store.delete_document(
        user_id=user_id,
        document_id=document_id,
        embedding_service=embedding_service
    )
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or does not belong to user")

    return DeleteResponse(
        document_id=document_id,
        user_id=user_id,
        deleted=True,
        message=f"Document {document_id} and associated vectors successfully purged."
    )

@app.post("/rag/query", response_model=QueryResponse, tags=["RAG Retrieval"], dependencies=[Security(verify_internal_token)])
def rag_query(request: QueryRequest):
    """
    Executes grounded RAG: retrieves relevant chunks strictly from the user's partition,
    scores similarity, builds a constrained prompt, and synthesizes an answer with citations.
    """
    user_id = sanitize_user_id(request.user_id)

    # 1. Retrieve top-k citations from isolated user partition
    citations = retriever.retrieve(
        user_id=user_id,
        question=request.question,
        top_k=request.top_k or settings.TOP_K
    )

    # 2. Synthesize answer with LLM / grounded synthesizer
    answer, is_grounded = llm_service.generate_answer(
        question=request.question,
        citations=citations
    )

    debug_info = None
    if request.debug_mode:
        stats = vector_store.get_user_stats(user_id)
        debug_info = {
            "user_stats": stats,
            "raw_scores": [c.score for c in citations],
            "top_k_requested": request.top_k or settings.TOP_K,
            "embedding_model": settings.EMBEDDING_MODEL_NAME,
            "llm_model": settings.GEMINI_MODEL
        }

    return QueryResponse(
        answer=answer,
        sources=citations,
        retrieved_chunks=len(citations),
        grounded=is_grounded,
        debug_info=debug_info
    )

@app.get("/rag/debug", tags=["RAG Retrieval"], dependencies=[Security(verify_internal_token)])
def rag_debug(
    user_id: str = Query(..., description="Tenant/User ID"),
    question: str = Query(..., description="Question to debug")
):
    """
    Diagnostic endpoint inspecting raw cosine similarity scores, vector dimensions, and user stats.
    """
    user_id = sanitize_user_id(user_id)
    stats = vector_store.get_user_stats(user_id)
    citations = retriever.retrieve(user_id=user_id, question=question, top_k=settings.TOP_K)
    return {
        "user_id": user_id,
        "user_stats": stats,
        "question": question,
        "citations_count": len(citations),
        "citations": [c.model_dump() for c in citations]
    }

@app.post("/rag/evaluate", tags=["Evaluation"], dependencies=[Security(verify_internal_token)])
def run_evaluation(
    user_id: str = Query(..., description="Tenant/User ID with seeded knowledge base"),
    top_k: int = Query(4, ge=1, le=10)
):
    """
    Executes the 16-question information retrieval benchmark calculating Precision@K, Recall@K, and MRR.
    """
    user_id = sanitize_user_id(user_id)
    metrics = evaluation_harness.run_benchmark(user_id=user_id, top_k=top_k)
    return metrics

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
