from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from googletrans import Translator
from gtts import gTTS
import io
from django.http import HttpResponse

class TranslateTTSAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            text = data.get('text')
            target_lang = data.get('target_lang')

            if not text or not target_lang:
                return Response({"error": "Missing 'text' or 'target_lang'"}, status=status.HTTP_400_BAD_REQUEST)

            translator = Translator()
            translated = translator.translate(text, dest=target_lang)
            
            tts = gTTS(text=translated.text, lang=target_lang)
            audio_io = io.BytesIO()
            tts.write_to_fp(audio_io)
            audio_io.seek(0)
            
            response = HttpResponse(audio_io, content_type='audio/mpeg')
            response['Content-Disposition'] = 'inline; filename=translated_audio.mp3'
            return response
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)