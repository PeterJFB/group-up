from rest_framework.test import APITestCase
from django.urls import reverse
from core.models import User
from rest_framework.authtoken.models import Token


class TestSetUp(APITestCase):
    def setUp(self) -> None:
        self.register_url = reverse("register")
        self.login_url = reverse("login")

        self.user_data = {
            "email": "test@gmail.com",
            "username": "testmann",
            "password": "pass",
        }
        self.user = User.objects.create_user(
            email=self.user_data["email"],
            username=self.user_data["username"],
            password=self.user_data["password"],
        )

        token = Token.objects.get_or_create(user=self.user)[0]
        self.tokenString = "Token " + token.key

        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()
