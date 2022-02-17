from rest_framework.test import APITestCase
from django.urls import reverse


class TestSetUp(APITestCase):
    def setUp(self) -> None:
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.hello_url = reverse("hello")

        self.user_data = {
            "username": "testmann",
            "email": "test@gmail.com",
            "password": "pass",
        }
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()
