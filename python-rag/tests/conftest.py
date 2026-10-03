import os
import sys
from pathlib import Path

# Ensure root python-rag directory is importable
rag_dir = Path(__file__).resolve().parent.parent
if str(rag_dir) not in sys.path:
    sys.path.insert(0, str(rag_dir))

# Configure test internal token for test suite
os.environ.setdefault("RAG_INTERNAL_TOKEN", "test-internal-token-for-pytest")

from config import settings
if not settings.INTERNAL_SERVICE_TOKEN:
    settings.INTERNAL_SERVICE_TOKEN = "test-internal-token-for-pytest"
