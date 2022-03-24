from django.test import TestCase
from django.urls import reverse
from .test_setup import TestSetUp
from core.models import User
from groupApp.models import InterestGroup, GroupUp
from rest_framework.test import APITestCase
from rest_framework import status


class GroupUpTestCase(TestCase):
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

    def testGroupUpCreation(self):
        test = GroupUp.objects.create(group1=self.group1, group2=self.group2)
        self.assertEqual(test.group1, self.group1)
        self.assertEqual(test.group2, self.group2)


class GroupMatchTestCaseApi(TestSetUp):
    def testGroupUpCreation(self):
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

        url = reverse("groupup-list")
        data = {"group1": self.group1.id, "group2": self.group2.id}
        response = self.client.post(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["group1"], self.group1.id)
        self.assertEqual(response.data["group2"], self.group2.id)

    def testInvalidGroupUpWithOneself(self):
        admin1 = User.objects.create_user(
            email="abc@123.no", username="admin", password="123"
        )
        self.group1 = InterestGroup.objects.create(
            name="group1", description="Test", groupAdmin=admin1
        )

        url = reverse("groupup-list")
        data = {"group1": self.group1.id, "group2": self.group1.id}
        response = self.client.post(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def testChangePlannedDate(self):
        admin1 = User.objects.create_user(
            email="abc@123.no", username="admin", password="123"
        )
        self.group1 = InterestGroup.objects.create(
            name="group1", description="Test", groupAdmin=admin1
        )
        self.group1.members.set([self.user])
        self.group2 = InterestGroup.objects.create(
            name="group2", description="Test2", groupAdmin=admin1
        )

        groupUp = GroupUp.objects.create(
            group1=self.group1,
            group2=self.group2,
            groupUpAccept=True,
        )

        url = reverse("groupup-detail", kwargs={"pk": groupUp.id})
        data = {"plannedDate": "2023-05-05"}
        response = self.client.patch(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["plannedDate"], "2023-05-05")

    def testCannotChangePlannedDateWhenNotMember(self):
        admin1 = User.objects.create_user(
            email="abc@123.no", username="admin", password="123"
        )
        self.group1 = InterestGroup.objects.create(
            name="group1", description="Test", groupAdmin=admin1
        )
        self.group2 = InterestGroup.objects.create(
            name="group2", description="Test2", groupAdmin=admin1
        )

        groupUp = GroupUp.objects.create(
            group1=self.group1,
            group2=self.group2,
            groupUpAccept=True,
            plannedDate="2023-10-10",
        )

        url = reverse("groupup-detail", kwargs={"pk": groupUp.id})
        data = {"plannedDate": "2023-05-05"}
        response = self.client.patch(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )
        self.assertEqual(response.status_code, 403)
