from rest_framework import serializers
from .models import CustomUser, Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    
    class Meta:
        model = Profile
        fields = ['username', 'email', 'full_name', 'role', 'age', 'phone', 'address']

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)
    profile = ProfileSerializer(required=False)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'role', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        profile_data = validated_data.pop('profile', {})
        user = CustomUser.objects.create_user(**validated_data)
        Profile.objects.create(user=user, role=role, **profile_data)
        return user
