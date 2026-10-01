import pytest
from services.chunker import Chunker

def test_chunker_basic():
    chunker = Chunker(chunk_size=100, chunk_overlap=20)
    pages = [
        {"page": 1, "text": "This is page one text. " * 10},
        {"page": 2, "text": "This is page two text. " * 10}
    ]
    chunks = chunker.chunk_document(
        pages=pages,
        user_id="user-123",
        document_id="doc-456",
        filename="notes.txt"
    )

    assert len(chunks) > 1
    for chunk in chunks:
        assert chunk["metadata"]["user_id"] == "user-123"
        assert chunk["metadata"]["document_id"] == "doc-456"
        assert chunk["metadata"]["filename"] == "notes.txt"
        assert chunk["metadata"]["page"] in [1, 2]
        assert len(chunk["text"]) <= 120 # within boundary tolerance

def test_chunker_empty_pages():
    chunker = Chunker(chunk_size=100, chunk_overlap=20)
    pages = [{"page": 1, "text": "   "}]
    chunks = chunker.chunk_document(pages, "user-1", "doc-1", "empty.txt")
    assert len(chunks) == 0

def test_chunker_invalid_overlap():
    with pytest.raises(ValueError):
        Chunker(chunk_size=100, chunk_overlap=100)
