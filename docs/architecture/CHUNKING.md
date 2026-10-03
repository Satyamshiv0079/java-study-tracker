# Document Chunking Strategies & Boundary Optimization

Chunking transforms continuous documents into semantically coherent vector units suitable for embedding and retrieval.

---

## 1. The Chunking Dilemma

Choosing chunk size is an optimization trade-off between two failure modes:

```
[Small Chunks (< 200 chars)]                [Large Chunks (> 2000 chars)]
       |                                                 |
       v                                                 v
Context Fragmentation                             Context Dilution
Sentences lose surrounding context;               Embedding vectors average out too many topics;
Pronoun referents and qualifiers are lost.        Specific technical answers get lost in noise.
```

---

## 2. Sliding Window with Boundary Preservation (CodeMentor Implementation)

In `python-rag/services/chunker.py`, we implement a **Sliding Window with Dynamic Boundary Detection**:

1. **Parameters:**
   - `CHUNK_SIZE = 600` characters (~100 to 120 words). Fits comfortably within MiniLM's 256 WordPiece token limit.
   - `CHUNK_OVERLAP = 60` characters (10% overlap).
2. **Boundary Search:**
   - When reaching the end of a window, the algorithm checks the trailing 30% of the window for sentence-ending punctuation (`.`, `?`, `!`, `\n`).
   - If a sentence break is found, the chunk boundary snaps to the end of the sentence, preventing truncated clauses.

```python
# Code from services/chunker.py
while start < text_len:
    end = min(start + self.chunk_size, text_len)
    
    # Sentence-aware snap within the trailing 30% of window
    if end < text_len:
        search_start = max(start + int(self.chunk_size * 0.7), start)
        snippet = text[search_start:end]
        match = list(re.finditer(r'[\.\?\!\n]\s+', snippet))
        if match:
            end = search_start + match[-1].end()

    chunk = text[start:end].strip()
    if chunk:
        chunks.append(chunk)

    start += (self.chunk_size - self.chunk_overlap)
```

---

## 3. Chunking Strategies Comparison

| Strategy | Advantages | Disadvantages | Best Used For |
| :--- | :--- | :--- | :--- |
| **Fixed-Character Chunking** | Simple, fast execution | Breaks words and sentences midway | Baseline prototypes |
| **Sliding Window + Sentence Snap** (Current) | Preserves semantic units, prevents fragmentation across edges | Slightly variable chunk lengths | **Technical docs, code notes, specifications** |
| **Recursive Character Chunking** | Tries paragraphs, then sentences, then words | More complex regex parsing | General text articles |
| **Semantic Similarity Chunking** | Splits based on embedding distance shifts between sentences | Requires $O(N)$ embedding passes before indexing | Research articles with distinct topical sections |
