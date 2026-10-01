import numpy as np
from services.embedding_service import EmbeddingService

def test_embedding_dimension_and_norm():
    service = EmbeddingService()
    text = "Spring Boot microservices architecture with Kafka."
    vec = service.encode(text, normalize=True)

    assert vec.shape == (1, 384)
    # Norm of L2-normalized vector should be approximately 1.0
    norm = np.linalg.norm(vec[0])
    assert abs(norm - 1.0) < 1e-4

def test_semantic_similarity():
    service = EmbeddingService()
    v1 = service.encode_query("Java garbage collection and JVM heap tuning")
    v2 = service.encode_query("Managing memory and garbage collector in the Java Virtual Machine")
    v3 = service.encode_query("Cooking Italian spaghetti with tomato basil sauce")

    # Cosine similarity via inner product on normalized vectors
    sim_related = float(np.dot(v1, v2.T)[0][0])
    sim_unrelated = float(np.dot(v1, v3.T)[0][0])

    assert sim_related > sim_unrelated
    assert sim_related > 0.60
    assert sim_unrelated < 0.35
