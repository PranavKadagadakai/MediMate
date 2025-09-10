from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ConversationHistory
from django.core.cache import cache
import logging
import os
from llama_cpp import Llama

logger = logging.getLogger("chatbot")
logger.setLevel(logging.INFO)

# Path to your DeepSeek R1 1.5B GGUF model file
MODEL_PATH = "/home/pranav/Projects/Web_Dev/MediMate/backend/models/DeepSeek-R1-1_5B.Q4_K_M.gguf" # BioMistral-7B.Q4_K_M.gguf

# Load the model once at startup
llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=2048,
    n_threads=4,  # adjust for your CPU
    verbose=False
)

SYSTEM_INSTRUCTION = (
    "You are a helpful, accurate and cautious medical assistant. "
    "Answer only the user's current question. If the user asks about a specific disease, "
    "give symptoms or information only for that disease and do not bring up unrelated diseases "
    "from prior conversation. Cite uncertainty and advise seeing a professional when appropriate.\n\n"
)


def get_or_create_history(user):
    obj, _ = ConversationHistory.objects.get_or_create(user=user)
    return obj


def build_prompt(history, user_input):
    prompt = SYSTEM_INSTRUCTION
    for msg in history[-8:]:
        role = msg.get("author")
        text = msg.get("text", "").strip()
        if not text:
            continue
        if role == "user":
            prompt += f"User: {text}\n"
        else:
            prompt += f"Assistant: {text}\n"
    prompt += f"User: {user_input}\nAssistant:"
    return prompt


def generate_reply_from_prompt(prompt: str) -> str:
    try:
        output = llm(
            prompt,
            max_tokens=256,
            temperature=0.7,
            top_p=0.95,
            stop=["User:", "Assistant:"]
        )
        # Get the generated text after the prompt
        reply = output["choices"][0]["text"].strip()
        if not reply:
            reply = "Sorry, I couldn't generate a response."
        return reply
    except Exception as e:
        logger.exception("Generation failed")
        return "Sorry, I couldn't generate a response due to an error."


class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_input = request.data.get("message", "")
        if user_input is None:
            user_input = ""
        user_input = user_input.strip()

        if not user_input:
            return Response({"error": "Message cannot be empty."}, status=400)
        if len(user_input) > 1000:
            return Response({"error": "Message too long. Limit to 1000 characters."}, status=400)

        # Rate limiting
        cache_key = f"chatbot_rate_{user.id}"
        req_count = cache.get(cache_key, 0)
        if req_count >= 10:
            return Response({"error": "Rate limit exceeded. Please wait before sending more messages."}, status=429)
        cache.set(cache_key, req_count + 1, timeout=60)

        # Retrieve and update conversation history
        history_obj = get_or_create_history(user)
        history = history_obj.history or []

        prompt = build_prompt(history, user_input)

        try:
            bot_reply = generate_reply_from_prompt(prompt)
            history_obj.add_message("user", user_input)
            history_obj.add_message("assistant", bot_reply)
            if len(history_obj.history) > 80:
                history_obj.history = history_obj.history[-80:]
                history_obj.save()

            logger.info(f"User {user.id} message processed")
            return Response({"response": bot_reply, "history": history_obj.history[-10:]})
        except Exception as e:
            logger.error(f"Chatbot error for user {user.id}: {e}")
            return Response({"error": "Chatbot failed to respond. Please try again later."}, status=500)
