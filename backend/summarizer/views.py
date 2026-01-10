import logging
import os

import requests
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .utils import detect_language, extract_text, is_supported_filetype

logger = logging.getLogger("summarizer")
logger.setLevel(logging.INFO)

# Ollama configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "deepseek-r1:8b"

# Safe chunk size for LLMs (chars, not tokens)
MAX_CHARS_PER_CHUNK = 3000


def ollama_summarize(text: str) -> str:
    """
    Sends text to Ollama DeepSeek-R1 model for summarization.
    """
    prompt = (
        "Summarize the following document clearly and concisely. "
        "Preserve key points and technical accuracy.\n\n"
        f"{text}"
    )

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.2, "top_p": 0.9},
    }

    response = requests.post(OLLAMA_URL, json=payload, timeout=300)
    response.raise_for_status()

    data = response.json()
    return data.get("response", "").strip()


class SummarizerAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if "file" not in request.FILES:
            return Response(
                {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = request.FILES["file"]
        filename = uploaded_file.name

        if not is_supported_filetype(filename):
            return Response(
                {"error": "Unsupported file format. Please upload PDF, DOCX, or TXT."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if uploaded_file.size > 5 * 1024 * 1024:
            return Response(
                {"error": "File too large. Maximum allowed size is 5MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            text = extract_text(uploaded_file)

            if not text or len(text.strip()) < 50:
                return Response(
                    {"error": "Document is empty or too short to summarize."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            lang = detect_language(text)
            if lang != "en":
                return Response(
                    {
                        "error": f"Document language detected as '{lang}'. Only English is supported."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Character-based chunking
            chunks = [
                text[i : i + MAX_CHARS_PER_CHUNK]
                for i in range(0, len(text), MAX_CHARS_PER_CHUNK)
            ]

            logger.info(
                f"Summarizing {filename} using DeepSeek-R1 with {len(chunks)} chunk(s)"
            )

            summary_parts = []
            for idx, chunk in enumerate(chunks, start=1):
                if not chunk.strip():
                    continue
                try:
                    summary = ollama_summarize(chunk)
                    summary_parts.append(summary)
                except Exception as e:
                    logger.error(f"Chunk {idx} summarization failed: {e}")
                    return Response(
                        {"error": f"Failed to summarize chunk {idx}."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            final_summary = " ".join(summary_parts)

            # Cleanup temp file if applicable
            if hasattr(uploaded_file, "temporary_file_path"):
                try:
                    os.remove(uploaded_file.temporary_file_path())
                except Exception:
                    pass

            return Response({"summary": final_summary})

        except requests.exceptions.ConnectionError:
            logger.error("Ollama server is not reachable")
            return Response(
                {"error": "Local Ollama service is not running."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except Exception as e:
            logger.error(f"Summarization error for {filename}: {e}")
            return Response(
                {
                    "error": "An error occurred during summarization. Please try again later."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
