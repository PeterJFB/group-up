from django.shortcuts import render

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response


class HelloView(APIView):
    """
    This is a simple view that returns "Hello World"
    It is there to be able to test that only atuhenticated users have access
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {"message": "Hello, World!"}
        return Response(content)
