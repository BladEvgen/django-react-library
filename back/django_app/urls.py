from django.urls import path
from django_app import views

urlpatterns = [
    path("api/book/", views.get_books, name="book-list"),
    path("api/categories/", views.get_categories, name="categories-list"),
    path("api/authors/", views.get_authors, name="authors-list"),
]
