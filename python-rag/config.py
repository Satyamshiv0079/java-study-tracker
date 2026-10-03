import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    INTERNAL_SERVICE_TOKEN: str = os.getenv("RAG_INTERNAL_TOKEN", "")
    ALLOWED_ORIGINS: str = os.getenv(
        "RAG_ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,http://localhost:8080,https://java-study-tracker.vercel.app,https://java-study-tracker-omega.vercel.app"
    )

    # Gemini LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Embedding Model Settings (Dense Numerical Representations)
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384

    # Chunking Strategy Settings
    CHUNK_SIZE: int = 600
    CHUNK_OVERLAP: int = 60

    # Retrieval & Similarity Settings
    TOP_K: int = 4
    SIMILARITY_THRESHOLD: float = 0.25

    # Storage Paths
    STORAGE_DIR: Path = BASE_DIR / "storage"
    USERS_STORAGE_DIR: Path = BASE_DIR / "storage" / "users"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
settings.USERS_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
