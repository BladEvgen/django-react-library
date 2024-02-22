from rest_framework import serializers
from django_app import models


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["name", "slug"]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Author
        fields = ["name", "slug"]


class BookSerializer(serializers.ModelSerializer):
    categories = serializers.StringRelatedField(many=True)
    authors = serializers.StringRelatedField(many=True)

    class Meta:
        model = models.Book
        fields = [
            "id",
            "title",
            "description",
            "book_image",
            "book_file",
            "categories",
            "authors",
        ]
