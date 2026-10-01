import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Union
from config import settings

class EmbeddingService:
    """
    Singleton service for generating dense vector embeddings using SentenceTransformers.
    All embeddings are L2-normalized so that FAISS IndexFlatIP computes exact Cosine Similarity.
    """
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._init_model()
        return cls._instance

    def _init_model(self):
        # Load local or HuggingFace model: all-MiniLM-L6-v2 (384 dimensions)
        self._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        self.dimension = settings.EMBEDDING_DIMENSION

    def encode(self, texts: Union[str, List[str]], normalize: bool = True) -> np.ndarray:
        """
        Generates dense vector embeddings for input text(s).
        Returns a 2D float32 numpy array of shape (N, dimension).
        """
        if isinstance(texts, str):
            texts = [texts]

        if not texts:
            return np.empty((0, self.dimension), dtype=np.float32)

        # Generate embeddings
        embeddings = self._model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=False,
            batch_size=32
        )

        embeddings = np.ascontiguousarray(embeddings, dtype=np.float32)

        if normalize:
            # In-place L2 normalization makes Inner Product equal Cosine Similarity
            faiss.normalize_L2(embeddings)

        return embeddings

    def encode_query(self, query: str) -> np.ndarray:
        """
        Encodes a single query string into a normalized 2D vector (1, dimension).
        """
        return self.encode([query], normalize=True)
