from django.test import TestCase
from core.models import User
from groupApp.models import InterestGroup, Interest
from django.urls import reverse
from .test_setup import TestSetUp


class InterestGroupTestCase(TestCase):
    def setUp(self):
        admin = User.objects.create_user(
            email="test123@test456.no", username="test123", password="test123"
        )
        self.test = InterestGroup.objects.create(
            name="Test", description="Test", groupAdmin=admin
        )

    def testInterestGroupCreation(self):
        admin2 = User.objects.create_user(
            email="abc@123.no", username="admin", password="123"
        )
        test2 = InterestGroup.objects.create(
            name="Test", description="Test", groupAdmin=admin2
        )
        self.assertEqual(test2.name, "Test")
        self.assertEqual(test2.description, "Test")
        self.assertEqual(test2.groupAdmin, admin2)


class InterestGroupTestCaseApi(TestSetUp):
    def testInterestGroupCreation(self):
        url = reverse("interestgroup-list")

        data = {
            "name": "test",
            "description": "heihei",
            "location": "fredrikstad",
            "meetingDate": "2023-10-05",
            "quote": "fiske",
            "interests": [{"name": "asd", "description": "asd"}],
        }

        response = self.client.post(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["name"], "test")
        self.assertEqual(response.data["description"], "heihei")
        group = InterestGroup.objects.get(name="test", description="heihei")
        self.assertEqual(group.groupAdmin, self.user)

    def testInterestGroupAddMember(self):
        admin = User.objects.create_user(
            email="test123@test456.no", username="test123", password="test123"
        )

        extraUser = User.objects.create_user(
            email="extraUser@mail.com", username="extraUser", password="123"
        )

        group = InterestGroup.objects.create(
            name="Test", description="Test", groupAdmin=admin
        )

        url = reverse("interestgroup-addMember", kwargs={"pk": group.id})

        data = {"user": extraUser.id}

        response = self.client.post(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["members"][0], extraUser.id)

    def testInterestGroupRemoveMember(self):
        admin = User.objects.create_user(
            email="test123@test456.no", username="test123", password="test123"
        )
        extraUser = User.objects.create_user(
            email="extraUser@mail.com", username="extraUser", password="123"
        )

        group = InterestGroup.objects.create(
            name="Test", description="Test", groupAdmin=admin
        )
        group.members.add(extraUser)

        url = reverse("interestgroup-removeMember", kwargs={"pk": group.id})

        data = {"user": extraUser.id}

        response = self.client.post(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["members"]), 0)

    def testInterestGroupUpdate(self):
        group = InterestGroup.objects.create(
            name="TestGroup",
            description="HEIHIE",
            location="Rommet",
            quote="quote",
            groupAdmin=self.user,
            date="2023-10-03",
        )

        url = reverse("interestgroup-detail", kwargs={"pk": group.id})

        data = {
            "name": "newName",
            "description": "newDesc",
            "location": "newLoc",
            "quote": "newQuote",
            "date": "2024-10-03",
            "interests": [{"name": "Fotball", "description": "Sport"}],
        }

        response = self.client.patch(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "newName")
        self.assertEqual(response.data["description"], "newDesc")
        self.assertEqual(response.data["location"], "newLoc")
        self.assertEqual(response.data["quote"], "newQuote")
        self.assertEqual(response.data["date"], "2024-10-03")
        self.assertEqual(
            response.data["interests"], [{"name": "Fotball", "description": "Sport"}]
        )

    def testInterestGroupUpdateUnauthorized(self):

        extraUser = User.objects.create_user(
            email="extraUser@mail.com", username="extraUser", password="123"
        )

        group = InterestGroup.objects.create(
            name="TestGroup",
            description="HEIHIE",
            location="Rommet",
            quote="quote",
            groupAdmin=extraUser,
            date="2023-10-03",
        )

        url = reverse("interestgroup-detail", kwargs={"pk": group.id})

        data = {
            "name": "newName",
            "description": "newDesc",
            "location": "newLoc",
            "quote": "newQuote",
            "date": "2024-10-03",
            "interests": [{"name": "Fotball", "description": "Sport"}],
        }

        response = self.client.patch(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )

        self.assertEqual(response.status_code, 403)
