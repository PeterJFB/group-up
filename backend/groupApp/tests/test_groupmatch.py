from django.test import TestCase
from django.urls import reverse
from .test_setup import TestSetUp
from core.models import User
from groupApp.models import InterestGroup, GroupMatch


class GroupMatchTestCase(TestCase):
    def setUp(self):
        admin1 = User.objects.create_user(
            email="abc@123.no", username="admin", password="123"
        )
        admin2 = User.objects.create_user(
            email="def@456.no", username="admin2", password="456"
        )
        self.group1 = InterestGroup.objects.create(
            name="group1", description="Test", groupAdmin=admin1
        )
        self.group2 = InterestGroup.objects.create(
            name="group2", description="Test2", groupAdmin=admin2
        )

    def testGroupMatchCreation(self):
        test = GroupMatch.objects.create(group1=self.group1, group2=self.group2)
        self.assertEqual(test.group1, self.group1)
        self.assertEqual(test.group2, self.group2)


class GroupMatchTestCaseApi(TestSetUp):
    def testGroupMatchCreation(self):
        admin1 = User.objects.create_user(
            email="abc@123.no", username="admin", password="123"
        )
        admin2 = User.objects.create_user(
            email="def@456.no", username="admin2", password="456"
        )
        self.group1 = InterestGroup.objects.create(
            name="group1", description="Test", groupAdmin=admin1
        )
        self.group2 = InterestGroup.objects.create(
            name="group2", description="Test2", groupAdmin=admin2
        )

        url = reverse("groupmatch-list")
        data = {"group1": self.group1.id, "group2": self.group2.id}
        response = self.client.post(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["group1"], self.group1.id)
        self.assertEqual(response.data["group2"], self.group2.id)
