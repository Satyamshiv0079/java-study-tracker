# Vector Embeddings & Dense Representations

Dense vector embeddings form the mathematical bedrock of semantic search and Retrieval-Augmented Generation in CodeMentor.

---

## 1. Dense vs Sparse Representations

| Dimension | Sparse Representations (e.g. TF-IDF, BM25) | Dense Representations (e.g. all-MiniLM-L6-v2) |
| :--- | :--- | :--- |
| **Dimensionality** | High (vocabulary size: 50,000 - 1,000,000+) | Low and fixed (384 dimensions) |
| **Vector Sparsity** | 99.9% zeros | Continuous real values (dense float32) |
| **Synonym Handling** | Fails on vocabulary mismatch ("JVM" vs "Java Virtual Machine") | Maps synonymous phrases to nearby coordinates in vector space |
| **Semantic Generalization** | Low (exact word stems only) | High (captures conceptual meaning, intent, grammar) |

---

## 2. Model Selection: `all-MiniLM-L6-v2`

CodeMentor utilizes `sentence-transformers/all-MiniLM-L6-v2`, trained on over 1 billion sentence pairs using self-supervised contrastive learning.

* **Base Model:** MiniLM (6 Transformer encoder layers, 12 attention heads).
* **Embedding Dimension:** 384.
* **Max Sequence Length:** 256 WordPiece tokens (~150-200 words).
* **Model Size:** ~80 MB (22.7M parameters).
* **Inference Speed:** ~14ms on standard x86 CPU.

---

## 3. Mathematical Foundations: L2 Normalization & Cosine Similarity

### Euclidean Norm (L2 Norm)
For any vector $\vec{v} = [v_1, v_2, \dots, v_D] \in \mathbb{R}^D$, its Euclidean length is:
$$\|\vec{v}\|_2 = \sqrt{\sum_{i=1}^D v_i^2}$$

A unit vector $\hat{v}$ is obtained by dividing $\vec{v}$ by its norm:
$$\hat{v} = \frac{\vec{v}}{\|\vec{v}\|_2} \implies \|\hat{v}\|_2 = 1$$

### Cosine Similarity to Dot Product Reduction
The cosine similarity between query $\vec{q}$ and document chunk $\vec{d}$ is:
$$\cos(\theta) = \frac{\vec{q} \cdot \vec{d}}{\|\vec{q}\|_2 \|\vec{d}\|_2}$$

When both $\vec{q}$ and $\vec{d}$ are pre-normalized to unit length ($\|\vec{q}\|_2 = 1$ and $\|\vec{d}\|_2 = 1$):
$$\cos(\theta) = \vec{q} \cdot \vec{d} = \sum_{i=1}^D q_i \cdot d_i$$

### Why this matters for production:
1. **Efficiency:** Computing a dot product requires only fused multiply-add (FMA) instructions, which modern CPUs execute using AVX2 SIMD in parallel.
2. **FAISS Integration:** It allows us to use `faiss.IndexFlatIP` (Inner Product) to compute exact Cosine Similarity with zero square root or trigonometric calls at search time.

---

## 4. Distance Metric Comparison

| Metric | Formula | Range | Interpretation in Vector Search |
| :--- | :--- | :--- | :--- |
| **Cosine Similarity** | $\frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\|_2 \|\vec{v}\|_2}$ | $[-1, 1]$ | Angle between vectors; invariant to text length. (1 = identical, 0 = orthogonal, -1 = opposite). |
| **Inner Product (Normalized)** | $\vec{u} \cdot \vec{v}$ | $[-1, 1]$ | Exactly equal to Cosine Similarity when vectors have unit norm. |
| **Euclidean Distance (L2)** | $\sqrt{\sum (u_i - v_i)^2}$ | $[0, \infty)$ | Straight-line distance. Lower is closer. Sensitive to vector magnitude. |

---

## 5. Code Implementation (`embedding_service.py`)

```python
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self):
        self._model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        self.dimension = 384

    def encode(self, texts, normalize=True):
        embeddings = self._model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=False,
            batch_size=32
        )
        embeddings = np.ascontiguousarray(embeddings, dtype=np.float32)
        if normalize:
            # In-place L2 normalization for exact cosine similarity in IndexFlatIP
            faiss.normalize_L2(embeddings)
        return embeddings
```
