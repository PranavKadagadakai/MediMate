from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from transformers import pipeline
from .utils import extract_text

class SummarizerAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']
        try:
            text = extract_text(uploaded_file)
            # Bart model has a limit of 1024 tokens. Truncate for safety.
            max_chunk_size = 1000
            chunks = [text[i:i+max_chunk_size] for i in range(0, len(text), max_chunk_size)]
            
            summary_parts = self.summarizer(chunks, max_length=150, min_length=30, do_sample=False)
            summary = " ".join([part['summary_text'] for part in summary_parts])
            
            return Response({"summary": summary})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)