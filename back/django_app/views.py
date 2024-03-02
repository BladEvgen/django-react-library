import json

from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, Paginator
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.core.cache import cache
from django_app import models, serializers, utils


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny])
def api(request: Request) -> Response:
    return Response(data={"message": "ok"})


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def api_users(request):
    user = request.user
    if user:
        return Response({"username": user.username, "email": user.email})
    else:
        return Response({"error": "User not found."}, status=400)


@api_view(http_method_names=["POST"])
@permission_classes([AllowAny])
def user_register(request):
    email = request.data.get("email", None)
    password = request.data.get("password", None)
    confirm_password = request.data.get("confirm_password", None)

    if password != confirm_password:
        return Response(
            {"error": "Пароли не совпадают"}, status=status.HTTP_400_BAD_REQUEST
        )

    if not utils.password_check(password):
        return Response(
            {"error": "Пароль недействителен"}, status=status.HTTP_400_BAD_REQUEST
        )

    if email and password:
        username = email.split("@")[0]
        user, created = User.objects.get_or_create(username=username, email=email)
        if created:
            user.password = make_password(password)
            user.save()
            return Response(
                {"success": "Пользователь успешно зарегистрирован"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"error": "Данная почта уже занята"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(
            {"error": "Требуются адрес электронной почты и пароль"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
def get_books(request: Request) -> Response:
    cache_key = f'books-{request.GET.get("category")}-{request.GET.get("author")}-{request.GET.get("id")}-{request.GET.get("page", default=1)}'
    data = cache.get(cache_key)
    if not data:
        queryset = models.Book.objects.all()
        category_slug = request.GET.get("category")
        if category_slug:
            category = get_object_or_404(models.Category, slug=category_slug)
            queryset = queryset.filter(categories=category)
        author_slug = request.GET.get("author")
        if author_slug:
            author = get_object_or_404(models.Author, slug=author_slug)
            queryset = queryset.filter(authors=author)
        book_id = request.GET.get("id")
        if book_id:
            queryset = queryset.filter(id=book_id)
        selected_page = request.GET.get(key="page", default=1)
        pages = Paginator(object_list=queryset, per_page=4)
        try:
            page = pages.page(number=selected_page)
        except EmptyPage:
            page = pages.page(1)

        serializer = serializers.BookSerializer(
            page.object_list, many=True, context={"request": request}
        )
        total_count = len(queryset)
        data = {
            "data": serializer.data,
            "total_count": total_count,
            "status": status.HTTP_200_OK,
        }
        cache.set(cache_key, data, 60)
    return Response(data)


@api_view(["GET"])
def get_categories(request: Request) -> Response:
    cache_key = "categories"
    data = cache.get(cache_key)
    if not data:
        categories = models.Category.objects.all()
        serializer = serializers.CategorySerializer(categories, many=True)
        data = {"data": serializer.data, "total_count": len(categories)}
        cache.set(cache_key, data, 60)
    return Response(data)


@api_view(["GET"])
def get_authors(request: Request) -> Response:
    cache_key = "authors"
    data = cache.get(cache_key)
    if not data:
        authors = models.Author.objects.all()
        serializer = serializers.AuthorSerializer(authors, many=True)
        data = {"data": serializer.data, "total_count": len(authors)}
        cache.set(cache_key, data, 60)
    return Response(data)


@csrf_exempt
@require_http_methods(["POST"])
def create_book(request: Request) -> Response:
    data = json.loads(request.body)
    book_data = data.get("bookData", [{}])[0]
    title = book_data.get("title", "")
    description = book_data.get("description", "")
    categories = book_data.get("categories", [])
    book_image = book_data.get("book_image", None)

    book = models.Book(title=title, description=description)
    book.book_file.save(book_image.name, book_image)
    book.save()

    for category_name in categories:
        category, created = models.Category.objects.get_or_create(name=category_name)
        book.categories.add(category)
    return Response({"status": status.HTTP_200_OK})
