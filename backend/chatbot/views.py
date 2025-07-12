from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from transformers import pipeline

class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Using a model more suitable for conversational Q&A
        self.qa_pipeline = pipeline("conversational", model="microsoft/DialoGPT-medium")

    def post(self, request):
        from transformers import Conversation
        
        user_input = request.data.get("message", "")
        # For simplicity, we don't maintain conversation history across requests.
        # A more advanced implementation would store and retrieve history.
        conversation = Conversation(user_input)
        response = self.qa_pipeline(conversation)
        return Response({"response": response.generated_responses[-1]})