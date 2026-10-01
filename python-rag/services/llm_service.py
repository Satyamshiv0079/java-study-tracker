import logging
import httpx
from typing import List, Tuple, Dict, Any, Optional
from models.schemas import SourceCitation
from config import settings

logger = logging.getLogger(__name__)

class LLMService:
    """
    Handles prompt construction and grounded LLM generation via Gemini.
    Enforces strict grounding, source citations, and honest lack-of-context fallback.
    """

    SYSTEM_PROMPT = (
        "You are an enterprise AI Mentor. Answer the candidate's question strictly and ONLY "
        "using the retrieved document context provided below.\n"
        "Rules:\n"
        "1. Do not invent facts, extrapolate, or use outside unverified knowledge.\n"
        "2. When stating facts from the context, include citation markers such as [Filename, p.X].\n"
        "3. If the context does not contain enough information to answer the question with certainty, "
        "reply strictly: 'I cannot find sufficient information in your uploaded documents to answer this question.'\n"
        "4. Be direct, technically rigorous, and concise."
    )

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL

    def build_prompt(self, question: str, citations: List[SourceCitation]) -> str:
        """
        Builds the grounded prompt containing citations and question.
        """
        if not citations:
            return (
                f"{self.SYSTEM_PROMPT}\n\n"
                f"RETRIEVED CONTEXT:\n[No relevant documents found]\n\n"
                f"QUESTION: {question}\n\n"
                f"ANSWER:"
            )

        context_blocks = []
        for idx, cit in enumerate(citations, 1):
            context_blocks.append(
                f"[Source {idx}: {cit.document}, Page {cit.page} (Similarity: {cit.score})]\n"
                f"{cit.snippet}\n"
            )

        full_context = "\n".join(context_blocks)
        prompt = (
            f"{self.SYSTEM_PROMPT}\n\n"
            f"RETRIEVED CONTEXT:\n{full_context}\n\n"
            f"QUESTION: {question}\n\n"
            f"ANSWER:"
        )
        return prompt

    def generate_answer(self, question: str, citations: List[SourceCitation]) -> Tuple[str, bool]:
        """
        Generates grounded answer. Returns (answer_text, is_grounded).
        """
        if not citations:
            return (
                "I cannot find sufficient information in your uploaded documents to answer this question.",
                False
            )

        prompt = self.build_prompt(question, citations)

        # If Gemini API key is configured, call Gemini API
        if self.api_key and self.api_key != "YOUR_GEMINI_API_KEY":
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 1024
                    }
                }
                with httpx.Client(timeout=30.0) as client:
                    resp = client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts:
                                answer = parts[0].get("text", "").strip()
                                return answer, True
                    logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}")
            except Exception as e:
                logger.error(f"Error calling Gemini API: {e}", exc_info=True)

        # Honest grounded extractive synthesis fallback when API key is not supplied or offline
        primary = citations[0]
        summary_lines = [
            f"Based on **{primary.document}** (p. {primary.page}, similarity score {primary.score}):",
            "",
            primary.snippet.strip(),
            "",
            "Sources referenced:"
        ]
        for c in citations:
            summary_lines.append(f"- [{c.document}, p. {c.page}] (score: {c.score})")

        return "\n".join(summary_lines), True
