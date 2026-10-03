# FAISS Vector Indexing & Search Architecture

FAISS (Facebook AI Similarity Search) is an open-source library optimized for high-performance nearest neighbor search in dense vector spaces.

---

## 1. Index Structures Comparison

| Index Type | Search Mechanism | Computational Complexity | Memory Overhead | Recall | Training Required? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`IndexFlatIP`** (Current) | Exhaustive inner product on all vectors | $O(N \cdot D)$ linear | Exact vector size ($N \times D \times 4$ bytes) | **100% (Exact)** | No |
| **`IndexFlatL2`** | Exhaustive Euclidean distance calculation | $O(N \cdot D)$ linear | Exact vector size | **100% (Exact)** | No |
| **`IndexIVFFlat`** | Inverted file index with Voronoi cells | $O(\frac{N}{C} \cdot nprobe \cdot D)$ | Low (adds centroid table) | ~90-98% (Approximate) | Yes (`index.train()`) |
| **`IndexHNSWFlat`** | Multi-layer graph hierarchical navigation | $O(\log N)$ logarithmic | High (stores graph edges for every node) | ~95-99% (Approximate) | No |
| **`IndexIVFPQ`** | Product Quantization compression + IVF | Sublinear | Extremely low (vector compression 8-16x) | ~75-90% (Approximate) | Yes |

---

## 2. Why `IndexFlatIP` is Optimal for CodeMentor

In a multi-tenant platform where vector storage is **partitioned per user**:
1. **Index Size per User:** Each user typically indexes between 10 and 20,000 chunks (e.g. study notes, resumes, specifications).
2. **Exhaustive Precision:** At $N \le 50,000$, `IndexFlatIP` searches in under **1 millisecond** using CPU AVX2 instructions.
3. **No Training Step:** Unlike `IndexIVFFlat`, which requires a large batch of training vectors to cluster centroids, `IndexFlatIP` is immediately operational from the first vector uploaded.
4. **Exact Cosine Similarity:** Because vectors are pre-normalized to unit norm ($\|\vec{v}\|_2 = 1$), the inner product provides 100% exact cosine similarity with zero approximation error.

---

## 3. Dynamic Index Persistence & Document Deletion

FAISS indexes written in C++ do not have native relational foreign keys. In `VectorStore`:
1. **Persistence:** Indexes are saved to disk using `faiss.write_index(index, filepath)` and loaded via `faiss.read_index(filepath)`.
2. **Metadata Synchronization:** Vector row index $i$ corresponds directly to index $i$ in `chunks.json`.
3. **Document Deletion:** When a document is removed:
   - Matching entries are purged from `chunks.json` and `documents.json`.
   - The remaining chunks are re-encoded and re-indexed into a clean `faiss.IndexFlatIP`. This avoids memory fragmentation and maintains continuous 0-indexed alignment.

```python
# Code snippet from services/vector_store.py
def delete_document(self, user_id: str, document_id: str, embedding_service=None):
    existing_chunks = self._load_chunks(user_id)
    remaining_chunks = [c for c in existing_chunks if c.get("metadata", {}).get("document_id") != document_id]
    
    # Rebuild clean index without deleted vector IDs
    new_index = faiss.IndexFlatIP(self.dimension)
    if remaining_chunks:
        texts = [c["text"] for c in remaining_chunks]
        new_embeddings = embedding_service.encode(texts, normalize=True)
        new_index.add(new_embeddings)
        
    self._save_index(user_id, new_index)
    self._save_chunks(user_id, remaining_chunks)
    return True
```
