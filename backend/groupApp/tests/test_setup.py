from rest_framework.test import APITestCase
from django.urls import reverse
from core.models import User
from rest_framework.authtoken.models import Token


class TestSetUp(APITestCase):
    def setUp(self) -> None:
        self.register_url = reverse("register")
        self.login_url = reverse("login")

        self.user_data = {
            "username": "testmann",
            "email": "test@gmail.com",
            "password": "pass",
        }
        self.user = User.objects.create_user(
            self.user_data["username"],
            self.user_data["email"],
            self.user_data["password"],
        )

        self.client.post(
            self.login_url,
            self.user_data,
            format="json",
        )  # log in

        self.tokenString = "Token " + Token.objects.get(user=self.user).key

        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()
