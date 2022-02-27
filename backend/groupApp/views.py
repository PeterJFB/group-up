from rest_framework import viewsets, permissions
from .models import InterestGroup, Interest, GroupMatch
from rest_framework.response import Response
from rest_framework.decorators import action
from core.permissions import UserAccesToGroupPermission, UserAccessToMatchPermission
import json

from .serializers import (
    InterestGroupSerializer,
    InterestSerializer,
    GroupMatchSerializer,
)


class InterestGroupViewSet(viewsets.ModelViewSet):
    queryset = InterestGroup.objects.all()
    serializer_class = InterestGroupSerializer
    permission_classes = [permissions.IsAuthenticated, UserAccesToGroupPermission]

    @action(
        methods=["post"],
        detail=True,
        url_path="addMember",
        url_name="addMember",
    )
    def addMember(self, request, pk=None):
        data = json.loads(request.body)
        user = data["user"]
        group = InterestGroup.objects.get(id=pk)
        group.members.add(user)
        group.save()
        return Response(InterestGroupSerializer(group).data, status=200)

    @action(
        methods=["post"],
        detail=True,
        url_path="removeMember",
        url_name="removeMember",
    )
    def removeMember(self, request, pk=None):
        data = json.loads(request.body)
        user = data["user"]
        group = InterestGroup.objects.get(id=pk)
        group.members.remove(user)
        group.save()
        return Response(InterestGroupSerializer(group).data, status=200)

    @action(
        methods=["get"],
        detail=True,
        url_path="getAges",
        url_name="getAges",
    )
    def getAges(self, request, pk=None):
        group = InterestGroup.objects.get(id=pk)
        ages = group.members.all().values_list("birthdate", flat=True)
        return Response(ages, status=200)


class InterestViewSet(viewsets.ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupMatchViewSet(viewsets.ModelViewSet):
    queryset = GroupMatch.objects.all()
    serializer_class = GroupMatchSerializer
    permission_classes = [permissions.IsAuthenticated, UserAccessToMatchPermission]
