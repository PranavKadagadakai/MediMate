from rest_framework import serializers
from .models import MedicalEntry

class MedicalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalEntry
        fields = ['id', 'user', 'entry_type', 'description', 'date']
        read_only_fields = ['user']