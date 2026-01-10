import logging

import requests

logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "deepseek-r1:8b"
TIMEOUT = 120  # seconds


def ollama_generate(prompt: str) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
            },
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip() or "No response generated."
    except Exception:
        logger.exception("Ollama generation failed")
        return "Sorry, the AI service is currently unavailable."
