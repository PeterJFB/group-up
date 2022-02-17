from core.models import User
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer


class RegisterView(CreateAPIView):
    """
    Create a view that takes a POST request
    with a username, email and password, and creates a user with that info
    """

    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        token, created = Token.objects.get_or_create(user_id=response.data["id"])
        response.data["token"] = str(token)
        return response
