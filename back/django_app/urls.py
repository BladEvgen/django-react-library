from django.urls import path
from django_app import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # * JWT TOKEN URL's
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # * Get Info about books
    path("api/book/", views.get_books, name="book-list"),
    path("api/categories/", views.get_categories, name="categories-list"),
    path("api/authors/", views.get_authors, name="authors-list"),
    path("api/users/", views.api_users),
    path("api/", views.api),
    # Links for User pages
    path("api/user_register/", views.user_register),
]
