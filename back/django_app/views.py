from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response
import time
from django_app.models import Book


@api_view(["GET"])
def get_books(request: Request) -> Response:
    queryset = Book.objects.all()
    selected_page = request.GET.get(key="page", default=1)
    pages = Paginator(object_list=queryset, per_page=2)
    page = pages.page(number=selected_page)

    serializer_data = [
        {
            "id": x.id,
            "title": x.title,
            "description": x.description,
            "book_file": (
                request.build_absolute_uri(x.book_file.url) if x.book_file else None
            ),
        }
        for x in page.object_list
    ]
    total_count = len(queryset)
    time.sleep(1)
    return Response({"data": serializer_data, "total_count": total_count})

    # "book_file": x.book_file
