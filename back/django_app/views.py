import json

from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, Paginator
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from django_app import models


@api_view(http_method_names=["GET"])
@permission_classes([AllowAny])  # 1 ур - всем
def api(request: Request) -> Response:
    return Response(data={"message": "ok"})


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])  # 2 ур - всем, кто аутентифицирован
def api_users(request: Request) -> Response:
    print(request.user)
    return Response(data={"message": User.objects.all()[0].username})


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

    serializer_data = [
        {
            "id": x.id,
            "title": x.title,
            "description": x.description,
            "book_image": (
                request.build_absolute_uri(x.book_image.url) if x.book_image else None
            ),
            "book_file": (
                request.build_absolute_uri(x.book_file.url) if x.book_file else None
            ),
            "categories": [category.name for category in x.categories.all()],
            "author_name": [author.name for author in x.authors.all()],
        }
        for x in page.object_list
    ]
    total_count = len(queryset)
    return Response(
        {
            "data": serializer_data,
            "total_count": total_count,
            "status": status.HTTP_200_OK,
        }
    )


@api_view(["GET"])
def get_categories(request: Request) -> Response:
    categories = models.Category.objects.all()
    serializer_data = [
        {"categories_title": category.name, "categories_slug": category.slug}
        for category in categories
    ]
    total_count = len(categories)
    return Response({"data": serializer_data, "total_count": total_count})


@api_view(["GET"])
def get_authors(request: Request) -> Response:
    authors = models.Author.objects.all()
    serializer_data = [
        {"author_name": author.name, "author_slug": author.slug} for author in authors
    ]
    total_count = len(authors)
    return Response({"data": serializer_data, "total_count": total_count})


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
