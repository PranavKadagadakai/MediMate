from rest_framework.views import APIView
from rest_framework.response import Response
from transformers import MarianMTModel, MarianTokenizer
from gtts import gTTS
import tempfile

model_name = 'Helsinki-NLP/opus-mt-en-fr'
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

class TranslateTTSAPIView(APIView):
    def post(self, request):
        text = request.data.get("text", "")
        translated = model.generate(**tokenizer(text, return_tensors="pt", padding=True))
        translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)

        tts = gTTS(text=translated_text, lang='fr')
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            tts.save(tmp.name)
            audio_url = request.build_absolute_uri('/media/' + tmp.name.split('/')[-1])
        return Response({"translated": translated_text, "audio_url": audio_url})