from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChunkMetadata(BaseModel):
    user_id: str
    document_id: str
    chunk_id: str
    filename: str
    page: int
    chunk_index: int
    char_count: int
    word_count: int

class DocumentMetadata(BaseModel):
    user_id: str
    document_id: str
    filename: str
    content_type: str
    total_chunks: int
    total_pages: int
    uploaded_at: str

class SourceCitation(BaseModel):
    document: str
    document_id: str
    page: int
    chunk_index: int
    score: float
    snippet: str

class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, description="The technical question or prompt")
    user_id: str = Field(..., min_length=1, description="Unique tenant / user identifier for isolated retrieval")
    top_k: Optional[int] = Field(None, ge=1, le=20, description="Number of top chunks to retrieve")
    debug_mode: bool = Field(False, description="When true, includes query embedding stats and prompt construction diagnostics")

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]
    retrieved_chunks: int
    grounded: bool
    debug_info: Optional[Dict[str, Any]] = None

class DocumentListResponse(BaseModel):
    user_id: str
    documents: List[DocumentMetadata]

class DeleteResponse(BaseModel):
    document_id: str
    user_id: str
    deleted: bool
    message: str

class HealthResponse(BaseModel):
    status: str
    service: str
    faiss_version: str
    embedding_model: str
    embedding_dim: int
