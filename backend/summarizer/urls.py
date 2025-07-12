from django.urls import path
from .views import SummarizerAPIView
urlpatterns = [
    path('summarize/', SummarizerAPIView.as_view(), name='summarize'),
]