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

from django_app import models, serializers


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny])  # 1 ур - всем
def api(request: Request) -> Response:
    return Response(data={"message": "ok"})


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])  # 2 ур - всем, кто аутентифицирован
def api_users(request):
    username = request.headers.get("Username", None)
    password = request.headers.get("Password", None)

    if username and password:
        user = User.objects.filter(username=username).first()
        if user and check_password(password, user.password):
            roles = []
            if user.is_superuser:
                roles.append("superuser")
            if user.is_staff:
                roles.append("staff")
            roles.append("user")
            return Response({"role": roles})
        else:
            return Response({"role": ["anonymous"]})
    else:
        return Response({"error": "Username and password are required."}, status=400)


@api_view(["GET"])
def get_books(request: Request) -> Response:
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
    return Response(
        {
            "data": serializer.data,
            "total_count": total_count,
            "status": status.HTTP_200_OK,
        }
    )


@api_view(["GET"])
def get_categories(request: Request) -> Response:
    categories = models.Category.objects.all()
    serializer = serializers.CategorySerializer(categories, many=True)
    return Response({"data": serializer.data, "total_count": len(categories)})


@api_view(["GET"])
def get_authors(request: Request) -> Response:
    authors = models.Author.objects.all()
    serializer = serializers.AuthorSerializer(authors, many=True)
    return Response({"data": serializer.data, "total_count": len(authors)})


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
