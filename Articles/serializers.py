from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "firstname", "lastname", "email", "date_of_birth"]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["firstname", "lastname", "title", "phone_number", "email"]


class AuthorToArticleSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = authorToarticle
        fields = ["author", "contribution_date"]


class ArticleSerializer(serializers.ModelSerializer):
    authors = AuthorToArticleSerializer(many=True, read_only=True)
    submitted_by = UserSerializer(read_only=True)  # Now it's writable
    reviewed_by = UserSerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "file",
            "cover_image",
            "published",
            "reviewed",
            "submitted_by",
            "reviewed_by",
            "created_at",
            "updated_at",
            "authors",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        article = Article.objects.create(submitted_by=user, **validated_data)
        return article

    def update(self, instance, validated_data):
        user = self.context["request"].user
        # user_data = validated_data.pop("submitted_by", None)
        instance.updated_by = (
            user  # Update the `updated_by` field with the current user
        )

        # Save the changes to the article
        instance.save()
        return instance


class createAuthorToArticleSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all())

    class Meta:
        model = authorToarticle
        fields = ["author", "article", "contribution_date"]


class createAuthorSerializer(serializers.ModelSerializer):
    # article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all())
    # article = ArticleSerializer()

    # class Meta:
    #    model = Author
    #    fields = ["firstname", "lastname", "title", "article", "contribution_date"]
    class Meta:
        model = Author
        fields = ["firstname", "lastname", "title", "phone_number", "email"]
