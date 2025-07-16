from rest_framework import serializers
from .models import Chat, Message
from users.serializers import ProfileSerializer
from users.models import CustomUser # Import CustomUser to ensure proper type hinting/access

class MessageSerializer(serializers.ModelSerializer):
    author_profile = ProfileSerializer(source='author.profile', read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'chat', 'author', 'content', 'timestamp', 'author_profile']
        read_only_fields = ['author', 'author_profile']

class ChatSerializer(serializers.ModelSerializer):
    # Change participants_profile to a SerializerMethodField
    participants_profile = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'participants', 'created_at', 'participants_profile']

    # Custom method to get and serialize participant profiles
    def get_participants_profile(self, obj):
        # obj here refers to the Chat instance
        profiles = []
        for participant in obj.participants.all():
            # Check if the participant actually has a profile linked
            if hasattr(participant, 'profile') and participant.profile:
                profiles.append(participant.profile)
        
        # Serialize the list of Profile objects using ProfileSerializer
        return ProfileSerializer(profiles, many=True, read_only=True).data