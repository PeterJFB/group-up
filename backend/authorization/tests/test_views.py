from .test_setup import TestSetUp
from core.models import User
from rest_framework.authtoken.models import Token


class TestViews(TestSetUp):
    def test_user_can_register(self):
        res = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(
            res.status_code,
            201,
            msg="The status code is not 201, the register is not successful",
        )
        self.assertIn(
            "token", res.data, msg="Token is not returned after successful register"
        )

    def test_user_cannot_register_with_no_data(self):
        res = self.client.post(self.register_url)

        self.assertEqual(
            res.status_code,
            400,
        )

    def test_user_can_login_with_correct_data(self):
        user = User.objects.create_user(
            self.user_data["username"],
            self.user_data["email"],
            self.user_data["password"],
        )
        res = self.client.post(self.login_url, self.user_data, format="json")

        self.assertEqual(
            res.status_code,
            200,
        )
        self.assertIn(
            "token", res.data, msg="Token is not returned after successful register"
        )

        token = Token.objects.get(user=user)
        self.assertEqual(res.data["token"], token.key)

    def test_user_cannot_login_with_incorrect_data(self):
        User.objects.create_user(
            self.user_data["username"],
            self.user_data["email"],
            self.user_data["password"],
        )
        res = self.client.post(self.login_url)

        self.assertEqual(
            res.status_code,
            400,
        )

    def test_user_cannot_login_with_wrong_data(self):
        user = User.objects.create_user(
            self.user_data["username"],
            self.user_data["email"],
            self.user_data["password"],
        )
        res = self.client.post(
            self.login_url,
            {
                "username": "testmann",
                "email": "test@gmail.com",
                "password": "wrongpass",
            },
        )
        self.assertEqual(
            res.status_code,
            400,
        )
