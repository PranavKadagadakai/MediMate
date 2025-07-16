from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from users.models import Profile, CustomUser
from users.serializers import ProfileSerializer

class DoctorListView(generics.ListAPIView):
    queryset = Profile.objects.filter(role='doctor')
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChatInitiateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, doctor_id):
        try:
            doctor = CustomUser.objects.get(id=doctor_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Doctor not found."}, status=status.HTTP_404_NOT_FOUND)

        patient = request.user

        chat = Chat.objects.filter(participants=doctor).filter(participants=patient).first()
        
        if not chat:
            chat = Chat.objects.create()
            chat.participants.add(doctor, patient)
        
        serializer = ChatSerializer(chat)
        return Response(serializer.data)

class ChatListView(generics.ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.chats.all()

class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        # ✨ FIX: Ensure the user is a participant of the chat they are trying to access.
        if not self.request.user.chats.filter(id=chat_id).exists():
            return Message.objects.none()
        return Message.objects.filter(chat_id=chat_id).order_by('timestamp')

    def perform_create(self, serializer):
        chat_id = self.kwargs['chat_id']
        # ✨ FIX: Double-check permission before creating a message.
        if not self.request.user.chats.filter(id=chat_id).exists():
            return Response({"error": "Not authorized to post in this chat."}, status=status.HTTP_403_FORBIDDEN)
            
        chat = Chat.objects.get(id=chat_id)
        serializer.save(author=self.request.user, chat=chat)