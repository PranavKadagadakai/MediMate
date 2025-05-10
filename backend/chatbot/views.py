from rest_framework.views import APIView
from rest_framework.response import Response
from transformers import pipeline

qa_pipeline = pipeline("text2text-generation", model="facebook/bart-large")

class ChatbotAPIView(APIView):
    def post(self, request):
        text = request.data.get("text", "")
        response = qa_pipeline(text)[0]['generated_text']
        return Response({"response": response})