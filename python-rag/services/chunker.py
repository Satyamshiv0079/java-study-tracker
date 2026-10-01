import re
from typing import List, Dict, Any
from models.schemas import ChunkMetadata
from config import settings

class Chunker:
    """
    Implements sliding-window document chunking with configurable overlap.
    Preserves document/page provenance and tracks character/word statistics.
    """

    def __init__(self, chunk_size: int = settings.CHUNK_SIZE, chunk_overlap: int = settings.CHUNK_OVERLAP):
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap must be strictly less than chunk_size")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document(
        self,
        pages: List[Dict[str, Any]],
        user_id: str,
        document_id: str,
        filename: str
    ) -> List[Dict[str, Any]]:
        """
        Chunks pages using sliding window strategy with sentence-aware break boundaries.
        Returns list of dicts:
        [
          {
            "chunk_id": str,
            "text": str,
            "metadata": ChunkMetadata
          }
        ]
        """
        chunks = []
        global_chunk_idx = 0

        for page_obj in pages:
            page_num = page_obj["page"]
            text = page_obj["text"].strip()
            if not text:
                continue

            page_chunks = self._chunk_text(text)
            for chunk_text in page_chunks:
                clean_chunk = chunk_text.strip()
                if not clean_chunk:
                    continue

                chunk_id = f"{document_id}_c{global_chunk_idx}"
                meta = ChunkMetadata(
                    user_id=user_id,
                    document_id=document_id,
                    chunk_id=chunk_id,
                    filename=filename,
                    page=page_num,
                    chunk_index=global_chunk_idx,
                    char_count=len(clean_chunk),
                    word_count=len(clean_chunk.split())
                )

                chunks.append({
                    "chunk_id": chunk_id,
                    "text": clean_chunk,
                    "metadata": meta.model_dump()
                })
                global_chunk_idx += 1

        return chunks

    def _chunk_text(self, text: str) -> List[str]:
        """
        Sliding-window chunking respecting sentence/paragraph boundaries when possible.
        """
        if len(text) <= self.chunk_size:
            return [text]

        chunks = []
        start = 0
        text_len = len(text)
        step = self.chunk_size - self.chunk_overlap

        while start < text_len:
            end = min(start + self.chunk_size, text_len)
            
            # If not at the end of the text, try to find a natural boundary (newline or period)
            if end < text_len:
                # Look for a sentence boundary (. / ? / ! / \n) within the last 20% of the chunk window
                boundary_search_start = max(start + int(self.chunk_size * 0.7), start)
                snippet = text[boundary_search_start:end]
                match = list(re.finditer(r'[\.\?\!\n]\s+', snippet))
                if match:
                    # Move end to the natural punctuation point
                    best_match = match[-1]
                    end = boundary_search_start + best_match.end()

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)

            if end >= text_len:
                break

            # Slide window forward by step
            start += step

        return chunks
