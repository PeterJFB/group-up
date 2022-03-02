from rest_framework.test import APITestCase
from django.urls import reverse


class TestSetUp(APITestCase):
    def setUp(self) -> None:
        self.register_url = reverse("register")
        self.login_url = reverse("login")

        self.user_data = {
            "username": "testmann",
            "email": "test@gmail.com",
            "password": "pass",
            "first_name": "test",
            "last_name": "mann",
            "birthdate": "2010-10-10",
        }
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()

    def register_user(self):
        self.client.post(self.register_url, self.user_data, format="json")
