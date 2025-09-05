from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from .serializers import RegisterSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# New API endpoint: List all patients (for doctor selection)
class PatientListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only allow doctors to list patients
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'doctor':
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        patients = Profile.objects.filter(role='patient')
        serializer = ProfileSerializer(patients, many=True)
        return Response(serializer.data)