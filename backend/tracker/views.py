from rest_framework import viewsets, permissions
from .models import MedicalEntry
from .serializers import MedicalEntrySerializer

class IsPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role == 'patient'

class MedicalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsPatient]

    def get_queryset(self):
        return MedicalEntry.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)