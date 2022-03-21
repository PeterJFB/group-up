from datetime import date, datetime, timedelta
from tokenize import group
from rest_framework.reverse import reverse
from rest_framework import status
from core.models import User
from groupApp.models import Interest, InterestGroup
from .test_setup import TestSetUp


class FindGroupUpFilterTestCase(TestSetUp):
    def setUp(self) -> None:
        self.url = reverse("interestgroup-findGroupUp", args=[1])

        self.admin1 = User.objects.create_user(
            email="abc@123.no", username="admin", password="123"
        )
        self.admin2 = User.objects.create(
            email="def@456.no",
            username="admin2",
            password="456",
            birthdate=(date.today() - timedelta(days=23 * 365)),
        )
        self.group1 = InterestGroup.objects.create(
            name="group1",
            description="Test",
            groupAdmin=self.admin1,
        )
        self.group2 = InterestGroup.objects.create(
            name="group2",
            description="Test2",
            groupAdmin=self.admin2,
            location="Kristiansand Dyrepark",
            meetingDate=date.today(),
        )
        self.group2.members.add(self.admin2)

        self.interest1 = Interest.objects.create(
            name="Kaffedrikking", description="Jeg elsker iskaffe"
        )

        self.group2.interests.add(self.interest1)

        return super().setUp()

    def testNoFilter(self):
        data = {}

        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(response.data[0]["id"], self.group2.id)

    def testLocation(self):
        data = {"location": "Tønsberg"}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(len(response.data), 0)

        data = {"location": "Kristiansand Dyrepark"}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(response.data[0]["id"], self.group2.id)

    def testAgeGap(self):
        data = {"ageMin": 24, "ageMax": 30}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(len(response.data), 0)

        data = {"ageMin": 18, "ageMax": 20}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(len(response.data), 0)

        data = {"ageMin": 20, "ageMax": 30}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(response.data[0]["id"], self.group2.id)

    def testMeetingDate(self):
        data = {"meetingDate": datetime.today().strftime("%Y-%m-%d")}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(response.data[0]["id"], self.group2.id)

        data = {"meetingDate": (datetime.today() + timedelta(1)).strftime("%Y-%m-%d")}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(len(response.data), 0)

    def testInterests(self):
        data = {"interests": "Heising"}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(len(response.data), 0)

        data = {"interests": "Kaffedrikking"}
        response = self.client.get(
            self.url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIs(len(response.data), 1)
