from rest_framework import serializers
from .models import Chat, Message
from users.serializers import ProfileSerializer

class MessageSerializer(serializers.ModelSerializer):
    author_profile = ProfileSerializer(source='author.profile', read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'chat', 'author', 'content', 'timestamp', 'author_profile']
        read_only_fields = ['author', 'author_profile']

class ChatSerializer(serializers.ModelSerializer):
    participants_profile = ProfileSerializer(source='participants.profile', many=True, read_only=True)
    class Meta:
        model = Chat
        fields = ['id', 'participants', 'created_at', 'participants_profile']