# HCLTech Campus — Fresher / Advanced Beginner GenAI Engineer Interview Preparation Guide

This guide maps every conceptual and architectural requirement of the **HCLTech Generative AI Engineer** role directly to production code implemented in **CodeMentor**.

---

## 1. Role Overview & Core Competency Checklist

| Competency Area | Theoretical Foundation | Concrete Implementation in CodeMentor |
| :--- | :--- | :--- |
| **Embeddings & Vector Spaces** | Dense vs sparse representations, cosine similarity, unit normalization | `python-rag/services/embedding_service.py` (`all-MiniLM-L6-v2`, 384-dim, L2-normalized) |
| **Vector Search & Indexing** | Nearest Neighbor search, Flat vs IVF vs HNSW indexes | `python-rag/services/vector_store.py` (`faiss.IndexFlatIP`) |
| **Document Processing & Chunking** | Sliding window, boundary preservation, context fragmentation | `python-rag/services/chunker.py` (600 chars, 60 char overlap, sentence breaks) |
| **RAG Grounding & Hallucinations** | Constrained prompt engineering, citation enforcement, out-of-context fallback | `python-rag/services/llm_service.py` (Gemini 2.5 Flash + citation markers `[doc, p.X]`) |
| **Tenant Data Isolation & Security** | Multi-tenant vector space security, zero cross-tenant leakage | `python-rag/services/vector_store.py` (`storage/users/{user_id}/`) + `test_user_isolation.py` |
| **Information Retrieval Evaluation** | Precision@K, Recall@K, Mean Reciprocal Rank (MRR) | `python-rag/services/evaluation.py` (16-question automated IR benchmark) |
| **Microservice & Gateway Architecture** | Decoupled Python AI engine + Spring Boot JWT tenant identity gateway | `RagProxyService.java` & `RagController.java` forwarding verified `principal.getId()` |

---

## 2. Deep Dive: Top 10 Technical Interview Questions & Answers

### Q1: What is Retrieval-Augmented Generation (RAG) and why is it preferred over fine-tuning for enterprise knowledge bases?
* **Answer:**
  * **Fine-Tuning:** Updates the internal neural network weights of an LLM. It is expensive, slow, prone to catastrophic forgetting, cannot reliably cite specific source documents, and cannot delete or update individual facts easily without retraining.
  * **RAG:** Separates knowledge storage (external vector database) from reasoning (the LLM). At query time, semantic search retrieves relevant chunks from user documents and injects them into the prompt.
  * **Enterprise Advantages:**
    1. **Dynamic updates:** Documents can be added, updated, or purged instantly in FAISS without modifying LLM weights.
    2. **Verifiable provenance:** Every response includes exact document names, page numbers, and similarity scores.
    3. **Tenant isolation:** Users can only retrieve their own private indexed documents.
    4. **Hallucination reduction:** The LLM is instructed to answer strictly based on retrieved context.

### Q2: What embedding model is used in your project and why?
* **Answer:**
  * We use **`sentence-transformers/all-MiniLM-L6-v2`** from Hugging Face.
  * **Architecture:** 6-layer BERT-based transformer encoder with 384-dimensional dense output vectors.
  * **Parameters:** ~22.7 Million parameters, compact footprint (~80MB).
  * **Inference Speed:** ~14ms per sentence on standard CPU, making it ideal for microservice deployment without requiring GPU hardware.
  * **Semantic Quality:** Consistently scores in top tiers of the MTEB (Massive Text Embedding Benchmark) for semantic search and clustering.

### Q3: Why do we L2-normalize embeddings before indexing in FAISS?
* **Answer:**
  * The cosine similarity between vectors $\vec{u}$ and $\vec{v}$ is:
    $$\cos(\theta) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\|_2 \|\vec{v}\|_2}$$
  * When vectors are L2-normalized such that $\|\vec{u}\|_2 = 1$ and $\|\vec{v}\|_2 = 1$, the denominator becomes 1:
    $$\cos(\theta) = \vec{u} \cdot \vec{v} = \sum_{i=1}^D u_i \cdot v_i$$
  * By calling `faiss.normalize_L2(embeddings)`, we can use **`faiss.IndexFlatIP`** (Inner Product), which calculates exact cosine similarity via fast SIMD dot products, achieving $O(N \cdot D)$ speed with zero trigonometric overhead.

### Q4: Explain the difference between `IndexFlatIP`, `IndexIVFFlat`, and `HNSW` in FAISS.
* **Answer:**
  * **`IndexFlatIP` (Exact Exhaustive Search):**
    * Computes dot product against every indexed vector.
    * **Precision:** 100% recall (exact).
    * **Tradeoff:** Linear time $O(N \cdot D)$. Ideal for tenant-isolated partitions (e.g. 100 to 50,000 vectors per user).
  * **`IndexIVFFlat` (Inverted File Index):**
    * Partitions vector space into $C$ Voronoi cells using K-Means clustering. At search time, only inspects the $nprobe$ closest centroids.
    * **Tradeoff:** Sublinear query time, but requires an offline training step (`index.train()`) and introduces a small approximation loss.
  * **`HNSW` (Hierarchical Navigable Small World):**
    * Multi-layer graph where greedy routing hops across long-range connections at top layers and fine-grained connections at bottom layers.
    * **Tradeoff:** Extremely fast sub-millisecond retrieval with logarithmic search time $O(\log N)$, but consumes significantly more RAM to store the edge graphs.

### Q5: What is your chunking strategy and why does overlap matter?
* **Answer:**
  * In `python-rag/services/chunker.py`, we employ a **sliding-window chunker** with:
    * `CHUNK_SIZE = 600` characters (~100-120 words).
    * `CHUNK_OVERLAP = 60` characters (~10% overlap).
    * **Sentence Boundary Preservation:** When sliding the window, our chunker looks back within the last 30% of the window for sentence-ending punctuation (`.`, `?`, `!`, `\n`) so sentences are never cut mid-thought.
  * **Why Overlap is Essential:**
    * Without overlap, if an important concept or entity definition spans across chunk boundaries (e.g., condition on page bottom, consequence on page top), semantic meaning is severed and neither chunk has sufficient context for retrieval.
    * Overlap preserves inter-chunk semantic continuity.

### Q6: How do you prevent hallucinations in your RAG system?
* **Answer:**
  1. **Strict System Prompt Constraints:** In `llm_service.py`, the system prompt mandates:
     > *"Answer strictly and ONLY using the retrieved document context. If the context does not contain enough information, reply: 'I cannot find sufficient information in your uploaded documents to answer this question.'"*
  2. **Mandatory Citations:** The prompt forces bracketed citations `[filename, p.X]`.
  3. **Low Temperature:** `temperature = 0.2` minimizes stochastic sampling and encourages deterministic, grounded output.
  4. **Similarity Thresholding:** If retrieved chunks fail to meet `SIMILARITY_THRESHOLD = 0.25`, no chunks are passed to the LLM, triggering the honest out-of-context fallback.

### Q7: How is multi-tenant user data isolation implemented?
* **Answer:**
  * **Zero Trust Architecture:**
    1. The client browser NEVER passes or dictates `user_id` to the Python RAG service.
    2. The Spring Boot backend (`RagController.java`) validates the user's JWT cryptographic signature and extracts the trusted `principal.getId()`.
    3. The Python service stores FAISS indexes in physically isolated directories: `python-rag/storage/users/{user_id}/`.
    4. Retrieval queries load ONLY `storage/users/{user_id}/index.faiss`.
  * **Verification:** An automated integration test (`test_user_isolation.py`) uploads secret documents under User A and verifies that User B querying the exact same keywords receives 0 results and 0 citations.

### Q8: What metrics do you use to evaluate retrieval quality?
* **Answer:**
  * Implemented in `python-rag/services/evaluation.py` across 16 benchmark questions:
  1. **Precision@K:** Proportion of the top-K retrieved chunks that are semantically relevant:
     $$\text{Precision@K} = \frac{|\text{Relevant Chunks} \cap \text{Top-K Retrievable}|}{K}$$
  2. **Recall@K:** Proportion of total known relevant knowledge chunks successfully retrieved:
     $$\text{Recall@K} = \frac{|\text{Relevant Chunks} \cap \text{Top-K Retrievable}|}{|\text{Total Known Relevant}|}$$
  3. **Mean Reciprocal Rank (MRR):** Measures where the first relevant chunk appears in the ranked results:
     $$\text{MRR} = \frac{1}{|Q|} \sum_{i=1}^{|Q|} \frac{1}{\text{rank}_i}$$
     Where $\text{rank}_i$ is the position of the first relevant result for query $i$. If the first result is relevant, rank is 1 (score 1.0). If second, rank is 2 (score 0.5).

### Q9: What is the Transformer Self-Attention mechanism?
* **Answer:**
  * In the Transformer architecture (Vaswani et al., 2017), self-attention enables every token in a sequence to dynamically attend to every other token based on contextual relevance.
  * For input embeddings $X$, three linear projections are computed:
    * **Query ($Q = X W_Q$):** What the current token is looking for.
    * **Key ($K = X W_K$):** What features the candidate token offers.
    * **Value ($V = X W_V$):** The actual content representation of the token.
  * **Scaled Dot-Product Attention Formula:**
    $$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$
  * Dividing by $\sqrt{d_k}$ prevents the dot products from growing excessively large for high dimensions, avoiding vanishing gradients during softmax backpropagation.

### Q10: How do Python RAG and Spring Boot communicate in production?
* **Answer:**
  * **Pattern:** API Gateway / Tenant Identity Proxy Pattern.
  * Spring Boot handles:
    * Rate Limiting (Token Bucket / `RateLimitingFilter`)
    * Security & JWT Validation (`JwtAuthenticationFilter`)
    * PostgreSQL relational data (Users, Progress, DSA submissions)
  * When a user performs RAG operations, Spring Boot's `RagProxyService` routes requests via HTTP/REST to the Python FastAPI microservice at `http://localhost:8000` (or Docker network DNS name in containerized clusters), injecting the verified tenant `user_id`.
  * If the Python RAG service is temporarily offline, Spring Boot returns a structured `503 Service Unavailable` with graceful client feedback.
