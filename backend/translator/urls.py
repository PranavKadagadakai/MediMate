from django.urls import path
from .views import TranslateTTSAPIView
urlpatterns = [ path('', TranslateTTSAPIView.as_view()) ]