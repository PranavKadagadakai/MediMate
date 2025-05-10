from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import UserQueryHistory
from .serializers import HistorySerializer

class HistoryViewSet(viewsets.ModelViewSet):
    queryset = UserQueryHistory.objects.all().order_by('-timestamp')
    serializer_class = HistorySerializer