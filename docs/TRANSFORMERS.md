# Transformer Architectures & Self-Attention Mechanics

The Transformer architecture (Vaswani et al., "Attention Is All You Need", 2017) powers modern Natural Language Processing and Generative AI.

---

## 1. Architectural Taxonomy

```
+--------------------------------------------------------------------------+
|                        Transformer Architectures                         |
+--------------------------------------------------------------------------+
       |                                      |
       v                                      v
[Encoder-Only Models]                 [Decoder-Only Models]
Examples: BERT, RoBERTa, MiniLM        Examples: GPT-4, LLaMA, Gemini Flash
Primary Task: Feature Extraction,     Primary Task: Autoregressive Text
Embeddings, Classification             Generation, Conversation, Reasoning
Mechanism: Bidirectional Attention     Mechanism: Causal (Masked) Attention
Role in CodeMentor: Document Embedding Role in CodeMentor: Grounded Answer Synth
```

---

## 2. The Self-Attention Mechanism (Mathematical Derivation)

Unlike Recurrent Neural Networks (RNNs) that process tokens sequentially ($O(N)$ sequential steps), Transformers compute cross-token relationships in parallel ($O(1)$ sequential operations).

### Step 1: Linear Projections
For an input matrix of token representations $X \in \mathbb{R}^{N \times d_{\text{model}}}$, we project into Query ($Q$), Key ($K$), and Value ($V$) matrices using learned weight matrices:
$$Q = X W_Q, \quad K = X W_K, \quad V = X W_V$$
where $W_Q, W_K \in \mathbb{R}^{d_{\text{model}} \times d_k}$ and $W_V \in \mathbb{R}^{d_{\text{model}} \times d_v}$.

### Step 2: Attention Score Computation
The compatibility between token $i$ and token $j$ is calculated via dot product:
$$\text{Score}_{ij} = q_i \cdot k_j^T$$

### Step 3: Scaling by $\sqrt{d_k}$
For large vector dimensions, dot products grow large in magnitude, pushing the softmax function into regions with near-zero gradients. Scaling stabilizes gradient backpropagation:
$$\text{Scaled Scores} = \frac{Q K^T}{\sqrt{d_k}}$$

### Step 4: Softmax Normalization
Converts raw scores into a probability distribution summing to 1 across the sequence:
$$A = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right)$$

### Step 5: Weighted Value Aggregation
$$\text{Attention}(Q, K, V) = A \cdot V = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$

---

## 3. Multi-Head Attention

Instead of performing a single attention function, Multi-Head Attention linearly projects queries, keys, and values $h$ times with different learned projections:
$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O$$
$$\text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$

**Intuition:** Different heads learn to attend to different linguistic relationships (e.g. Head 1 tracks subject-verb agreement, Head 2 tracks pronoun coreference, Head 3 tracks technical nouns).

---

## 4. Why Positional Encodings are Required

Because the self-attention formula $\text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$ is permutation-equivariant (it has no inherent notion of sequence order), Transformers inject positional vectors $P$ into token embeddings:
$$X = \text{TokenEmbedding}(T) + \text{PositionalEncoding}$$

Using sinusoidal functions:
$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$
$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$
This enables the model to easily learn relative positions because for any fixed offset $k$, $PE_{pos+k}$ can be represented as a linear function of $PE_{pos}$.
