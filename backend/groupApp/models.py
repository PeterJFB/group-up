from django.db import models
from core.models import User


class InterestGroup(models.Model):
    name = models.CharField(max_length=255, default="")
    description = models.TextField(max_length=500, default="")
    members = models.ManyToManyField(User, blank=True)
    location = models.CharField(max_length=255, default="")
    wantToDoNext = models.TextField(max_length=500, default="")
    groupAdmin = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, default=None, related_name="admin"
    )
    interests = models.ManyToManyField("Interest", blank=True)
    date = models.DateField("Date", blank=True, null=True)
    matches = models.ManyToManyField("GroupMatch", blank=True)
    sentLikes = models.ManyToManyField(
        "InterestGroup", blank=True, related_name="SentLikes"
    )
    meetingDate = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=1000, default="")
    quote = models.CharField(max_length=150, default="")

    REQUIRED_FIELDS = ["name", "description", "groupAdmin"]

    def __str__(self):
        return self.name


class Interest(models.Model):
    name = models.CharField(max_length=255, default="")
    description = models.TextField(default="")

    REQUIRED_FIELDS = ["name", "description"]

    def __str__(self):
        return self.name


class GroupMatch(models.Model):
    group1 = models.ForeignKey(
        InterestGroup, on_delete=models.CASCADE, related_name="group1"
    )

    group2 = models.ForeignKey(
        InterestGroup, on_delete=models.CASCADE, related_name="group2"
    )
    group2Accept = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["group1", "group2"]

    def __str__(self):
        return self.group1.name + " " + self.group2.name
