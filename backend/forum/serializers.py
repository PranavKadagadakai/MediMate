from rest_framework import serializers
from .models import Post, Comment
from users.serializers import ProfileSerializer

class AuthorProfileMixin(serializers.Serializer):
    author_profile = ProfileSerializer(source='author.profile', read_only=True)

class CommentSerializer(serializers.ModelSerializer, AuthorProfileMixin):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'content', 'created_at', 'author', 'author_profile']
        read_only_fields = ['author', 'author_profile']

class PostSerializer(serializers.ModelSerializer, AuthorProfileMixin):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'author', 'author_profile', 'comments']
        read_only_fields = ['author', 'author_profile', 'comments']