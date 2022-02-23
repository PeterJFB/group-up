from django.test import TestCase
from groupApp.models import Interest
from django.urls import reverse
from .test_setup import TestSetUp


class InterestTestCase(TestCase):
    def testInterestCreation(self):
        test = Interest.objects.create(name="Test", description="Test")
        self.assertEqual(test.name, "Test")
        self.assertEqual(test.description, "Test")


class InterestTestCaseApi(TestSetUp):
    def testInterestCreation(self):

        url = reverse("interest-list")
        data = {"name": "Test", "description": "Test"}
        response = self.client.post(
            url, data, HTTP_AUTHORIZATION=self.tokenString, format="json"
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["name"], "Test")
        self.assertEqual(response.data["description"], "Test")
