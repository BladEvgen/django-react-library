from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken


class CustomCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Headers"] = "*"

        return response


class TokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.COOKIES.get("accessToken")
        if token:
            try:
                AccessToken(token)
            except InvalidToken:
                return JsonResponse({"error": "Invalid token"}, status=401)
