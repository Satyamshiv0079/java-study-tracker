from typing import List, Dict, Any, Set
from models.schemas import SourceCitation
from services.retriever import Retriever

BENCHMARK_QUESTIONS = [
    {
        "id": "q1",
        "question": "What is the difference between Heap and Stack memory in Java?",
        "expected_keywords": {"heap", "stack", "memory", "garbage", "thread", "object"}
    },
    {
        "id": "q2",
        "question": "How does Spring Boot @EnableAutoConfiguration work under the hood?",
        "expected_keywords": {"spring.factories", "autoconfiguration", "conditionalonclass", "configuration"}
    },
    {
        "id": "q3",
        "question": "What is the sliding window chunking strategy in RAG?",
        "expected_keywords": {"chunk", "window", "overlap", "sliding", "boundary", "context"}
    },
    {
        "id": "q4",
        "question": "Why do we normalize vectors before indexing with FAISS IndexFlatIP?",
        "expected_keywords": {"cosine", "inner product", "l2", "normalize", "unit", "dot"}
    },
    {
        "id": "q5",
        "question": "How is multi-tenant user data isolation enforced in this vector search service?",
        "expected_keywords": {"tenant", "isolation", "partition", "user_id", "directory", "faiss"}
    },
    {
        "id": "q6",
        "question": "How does Circuit Breaker pattern prevent cascading failures in microservices?",
        "expected_keywords": {"circuit", "breaker", "resilience4j", "fallback", "open", "half-open"}
    },
    {
        "id": "q7",
        "question": "What is the difference between Idempotent and Non-idempotent HTTP methods?",
        "expected_keywords": {"idempotent", "get", "put", "delete", "post", "side-effect"}
    },
    {
        "id": "q8",
        "question": "What does Mean Reciprocal Rank (MRR) measure in retrieval evaluation?",
        "expected_keywords": {"mrr", "rank", "reciprocal", "first", "relevant", "position"}
    },
    {
        "id": "q9",
        "question": "How do dense vector embeddings capture semantic similarity?",
        "expected_keywords": {"dense", "embedding", "semantic", "dimension", "representation", "minilm"}
    },
    {
        "id": "q10",
        "question": "What is the role of HikariCP in Spring Boot database connections?",
        "expected_keywords": {"hikaricp", "connection", "pool", "datasource", "jdbc", "performance"}
    },
    {
        "id": "q11",
        "question": "How does JWT stateless authentication eliminate server session storage?",
        "expected_keywords": {"jwt", "token", "signature", "stateless", "claims", "header"}
    },
    {
        "id": "q12",
        "question": "What is the role of temperature in LLM generation?",
        "expected_keywords": {"temperature", "randomness", "deterministic", "greedy", "sampling"}
    },
    {
        "id": "q13",
        "question": "How do you prevent hallucinations in retrieval-augmented generation?",
        "expected_keywords": {"hallucination", "grounding", "citation", "prompt", "context", "constraint"}
    },
    {
        "id": "q14",
        "question": "What is the difference between IndexFlatL2 and IndexFlatIP in FAISS?",
        "expected_keywords": {"indexflatl2", "indexflatip", "euclidean", "distance", "similarity", "cosine"}
    },
    {
        "id": "q15",
        "question": "What is the difference between Precision@K and Recall@K?",
        "expected_keywords": {"precision@k", "recall@k", "top_k", "relevant", "retrieved", "metrics"}
    },
    {
        "id": "q16",
        "question": "How does Spring Security filter chain authenticate incoming requests?",
        "expected_keywords": {"securityfilterchain", "filter", "onceperrequestfilter", "authentication", "principal"}
    }
]

class EvaluationHarness:
    """
    Evaluates RAG retrieval quality across standard metrics:
    - Precision@K
    - Recall@K
    - Mean Reciprocal Rank (MRR)
    """

    def __init__(self, retriever: Retriever):
        self.retriever = retriever

    @staticmethod
    def is_chunk_relevant(snippet: str, expected_keywords: Set[str]) -> bool:
        lower_snippet = snippet.lower()
        matches = sum(1 for kw in expected_keywords if kw in lower_snippet)
        # Relevant if at least 1-2 key terms appear in chunk
        return matches >= 1

    def run_benchmark(self, user_id: str, top_k: int = 4) -> Dict[str, Any]:
        """
        Runs all benchmark questions against the given user_id's index and calculates metrics.
        """
        results = []
        reciprocal_ranks = []
        precisions = []
        recalls = []

        for item in BENCHMARK_QUESTIONS:
            q_id = item["id"]
            question = item["question"]
            expected = item["expected_keywords"]

            citations: List[SourceCitation] = self.retriever.retrieve(
                user_id=user_id,
                question=question,
                top_k=top_k
            )

            # Evaluate relevance for each citation
            relevant_retrieved = 0
            first_relevant_rank = 0

            for rank, cit in enumerate(citations, 1):
                if self.is_chunk_relevant(cit.snippet, expected):
                    relevant_retrieved += 1
                    if first_relevant_rank == 0:
                        first_relevant_rank = rank

            # Precision@K = (relevant retrieved) / K
            p_at_k = relevant_retrieved / top_k if top_k > 0 else 0.0
            precisions.append(p_at_k)

            # Recall@K estimate (assuming at least 1 relevant chunk exists in knowledge base)
            r_at_k = 1.0 if relevant_retrieved >= 1 else 0.0
            recalls.append(r_at_k)

            # Reciprocal Rank = 1 / rank
            rr = (1.0 / first_relevant_rank) if first_relevant_rank > 0 else 0.0
            reciprocal_ranks.append(rr)

            results.append({
                "id": q_id,
                "question": question,
                "top_k_retrieved": len(citations),
                "relevant_count": relevant_retrieved,
                "precision_at_k": round(p_at_k, 3),
                "recall_at_k": round(r_at_k, 3),
                "first_relevant_rank": first_relevant_rank,
                "reciprocal_rank": round(rr, 3)
            })

        num_q = len(BENCHMARK_QUESTIONS)
        mean_precision = sum(precisions) / num_q if num_q else 0.0
        mean_recall = sum(recalls) / num_q if num_q else 0.0
        mrr = sum(reciprocal_ranks) / num_q if num_q else 0.0

        return {
            "total_benchmark_questions": num_q,
            "top_k": top_k,
            "mean_precision_at_k": round(mean_precision, 4),
            "mean_recall_at_k": round(mean_recall, 4),
            "mean_reciprocal_rank_mrr": round(mrr, 4),
            "query_results": results
        }
