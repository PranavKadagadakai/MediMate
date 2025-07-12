from django.urls import path
from .views import DoctorListView, ChatInitiateView, ChatListView, MessageListView

urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('chats/', ChatListView.as_view(), name='chat-list'),
    path('chats/initiate/<int:doctor_id>/', ChatInitiateView.as_view(), name='chat-initiate'),
    path('chats/<int:chat_id>/messages/', MessageListView.as_view(), name='message-list'),
]