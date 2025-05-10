from rest_framework.views import APIView
from rest_framework.response import Response
from transformers import pipeline

summarizer = pipeline("summarization", model="allenai/led-base-16384")

class SummarizerAPIView(APIView):
    def post(self, request):
        text = request.data.get("text", "")
        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)[0]['summary_text']
        return Response({"summary": summary})