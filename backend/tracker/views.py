from rest_framework import viewsets, permissions
from .models import MedicalEntry
from .serializers import MedicalEntrySerializer


# Custom permission: Patients can only view their own, doctors can view any
class IsDoctorOrPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role in ['doctor', 'patient']



from rest_framework import status
from rest_framework.response import Response

class MedicalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOrPatient]

    def get_queryset(self):
        user = self.request.user
        if user.profile.role == 'doctor':
            patient_id = self.request.query_params.get('patient_id')
            if patient_id:
                return MedicalEntry.objects.filter(user_id=patient_id).order_by('-date')
            return MedicalEntry.objects.none()
        return MedicalEntry.objects.filter(user=user).order_by('-date')

    def create(self, request, *args, **kwargs):
        # Only doctors can add entries
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'doctor':
            return Response({'detail': 'Only doctors can add entries.'}, status=status.HTTP_403_FORBIDDEN)
        patient_id = request.data.get('patient_id')
        if not patient_id:
            return Response({'detail': 'patient_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            patient = MedicalEntry._meta.get_field('user').related_model.objects.get(id=patient_id)
        except Exception:
            return Response({'detail': 'Invalid patient_id.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, patient)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, patient=None):
        # Set user to patient instance
        if patient is not None:
            serializer.save(user=patient)
        else:
            serializer.save()

    def update(self, request, *args, **kwargs):
        return Response({'detail': 'Editing entries is not allowed.'}, status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        return Response({'detail': 'Editing entries is not allowed.'}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'Deleting entries is not allowed.'}, status=status.HTTP_403_FORBIDDEN)