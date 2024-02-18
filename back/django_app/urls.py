from django.urls import path
from django_app import views

urlpatterns = [
    path('api/book/', views.get_books, name='book-list'),
]
