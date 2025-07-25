from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from googletrans import Translator
from gtts import gTTS
import io
import base64
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

class TranslateTTSAPIView(APIView):
    """
    Handles text translation and converts the translated text to speech.
    Accepts 'text', 'target_lang', and optional 'source_lang'.
    Returns a JSON response with the translated text and base64-encoded audio.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            text = data.get('text')
            target_lang = data.get('target_lang')
            source_lang = data.get('source_lang', 'auto')

            if not text or not target_lang:
                return Response(
                    {"error": "Missing 'text' or 'target_lang' parameter."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            translator = Translator()
            translated = translator.translate(text, src=source_lang, dest=target_lang)
            translated_text = translated.text

            tts = gTTS(text=translated_text, lang=target_lang)
            audio_io = io.BytesIO()
            tts.write_to_fp(audio_io)
            audio_io.seek(0)

            audio_base64 = base64.b64encode(audio_io.read()).decode('utf-8')

            response_data = {
                'translated_text': translated_text,
                'audio_base64': audio_base64
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the full exception for better debugging
            logger.error(f"Translation/TTS error for request data {request.data}: {e}", exc_info=True)
            
            error_message = f"An unexpected error occurred on the server."
            if "not supported" in str(e).lower():
                error_message = f"The language '{request.data.get('target_lang')}' may not be supported for Text-to-Speech."
            elif "Failed to connect" in str(e):
                 error_message = "Could not connect to the translation service. Please try again later."

            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)