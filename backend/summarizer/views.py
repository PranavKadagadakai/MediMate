from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

import logging
from transformers import pipeline, AutoTokenizer
from .utils import extract_text, detect_language, is_supported_filetype
import os


# Efficient model/tokenizer loading
SUMMARIZER_MODEL = "facebook/bart-large-cnn"
summarizer = pipeline("summarization", model=SUMMARIZER_MODEL)
tokenizer = AutoTokenizer.from_pretrained(SUMMARIZER_MODEL)

logger = logging.getLogger("summarizer")
logger.setLevel(logging.INFO)

class SummarizerAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']
        filename = uploaded_file.name
        # Validate file type
        if not is_supported_filetype(filename):
            return Response({"error": "Unsupported file format. Please upload PDF, DOCX, or TXT."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file size (limit to 5MB)
        if uploaded_file.size > 5 * 1024 * 1024:
            return Response({"error": "File too large. Maximum allowed size is 5MB."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            text = extract_text(uploaded_file)
            if not text or len(text.strip()) < 50:
                return Response({"error": "Document is empty or too short to summarize."}, status=status.HTTP_400_BAD_REQUEST)

            # Language detection
            lang = detect_language(text)
            if lang != "en":
                return Response({"error": f"Document language detected as '{lang}'. Only English is supported."}, status=status.HTTP_400_BAD_REQUEST)


            # Improved chunking: split text into chunks of <=1024 tokens, summarize each
            max_tokens = 1024
            words = text.split()
            chunks = []
            current_chunk = []
            current_len = 0
            for word in words:
                token_len = len(tokenizer.tokenize(word))
                if current_len + token_len > max_tokens:
                    if current_chunk:
                        chunks.append(' '.join(current_chunk))
                    current_chunk = [word]
                    current_len = token_len
                else:
                    current_chunk.append(word)
                    current_len += token_len
            if current_chunk:
                chunks.append(' '.join(current_chunk))

            # If no valid chunks, fallback to summarizing the whole text
            if not chunks:
                if text.strip():
                    chunks = [text.strip()]
                else:
                    return Response({"error": "Failed to process document into valid chunks."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            logger.info(f"Summarizing {filename} with {len(chunks)} chunk(s)")

            summary_parts = []
            for idx, chunk in enumerate(chunks):
                try:
                    if not chunk.strip():
                        continue
                    part = summarizer(chunk, max_length=150, min_length=30, do_sample=False)[0]
                    summary_parts.append(part['summary_text'])
                except Exception as e:
                    logger.error(f"Chunk {idx+1} failed: {e}")
                    return Response({"error": f"Failed to summarize chunk {idx+1}: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            summary = " ".join(summary_parts)

            # Clean up file if needed (in-memory files are auto-cleaned)
            if hasattr(uploaded_file, 'temporary_file_path'):
                try:
                    os.remove(uploaded_file.temporary_file_path())
                except Exception:
                    pass

            return Response({"summary": summary})
        except Exception as e:
            logger.error(f"Summarization error for {filename}: {e}")
            return Response({"error": "An error occurred during summarization. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)