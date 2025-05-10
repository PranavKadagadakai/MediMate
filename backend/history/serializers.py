from rest_framework.serializers import ModelSerializer
from .models import UserQueryHistory

class HistorySerializer(ModelSerializer):
    class Meta:
        model = UserQueryHistory
        fields = '__all__'