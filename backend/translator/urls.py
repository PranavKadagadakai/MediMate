from django.urls import path
from .views import TranslateTTSAPIView

urlpatterns = [
    path('translate/', TranslateTTSAPIView.as_view(), name='translate_tts'),
]