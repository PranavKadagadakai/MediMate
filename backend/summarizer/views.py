from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from transformers import pipeline
from .utils import extract_text

summarizer = pipeline("summarization", model="allenai/led-base-16384")

class SummarizerAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']
        try:
            text = extract_text(uploaded_file)
            if len(text) > 1024:
                text = text[:1024]
            summary = summarizer(text, max_length=512, min_length=30, do_sample=False)[0]['summary_text']
            return Response({"summary": summary})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
