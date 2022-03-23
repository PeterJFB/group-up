from datetime import datetime
from django.db.models import Q
from rest_framework import viewsets, permissions
from .models import InterestGroup, Interest, GroupUp
from core.models import User
from rest_framework.response import Response
from rest_framework.decorators import action
from core.permissions import (
    UserAccessToMatchPermission,
    UserAdminForGroupPermission,
)
import json

from .serializers import (
    InterestGroupSerializer,
    InterestSerializer,
    GroupUpSerializer,
)


class InterestGroupViewSet(viewsets.ModelViewSet):
    queryset = InterestGroup.objects.all()
    serializer_class = InterestGroupSerializer
    permission_classes = [permissions.IsAuthenticated, UserAdminForGroupPermission]

    @action(
        methods=["post"],
        detail=True,
        url_path="addMember",
        url_name="addMember",
    )
    def addMember(self, request, pk=None):
        group = self.get_object()
        data = json.loads(request.body)
        user = User.objects.get(email=data["email"])
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
        group = self.get_object()
        data = json.loads(request.body)
        user = User.objects.get(email=data["email"])
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
        group = self.get_object()
        ages = group.members.all().values_list("birthdate", flat=True)
        return Response(ages, status=200)

    @action(
        methods=["get"],
        detail=False,
        url_path="getMyGroups",
        url_name="getMyGroups",
    )
    def getMyGroups(self, request):
        groups = self.user.my_groups.all()
        serialized = InterestGroupSerializer(groups, many=True).data
        return Response(serialized, status=200)

    @action(
        methods=["get"],
        detail=True,
        url_path="findGroupUp",
        url_name="findGroupUp",
    )
    def findGroupUp(self, request, pk=None):
        queryset = self.queryset.exclude(pk=pk)

        # Using existing groupups to filter
        outgoing_groupup = GroupUp.objects.all().filter(group1_id=pk)
        incoming_groupup = GroupUp.objects.all().filter(group2_id=pk)

        accepted_incoming_groupup = incoming_groupup.filter(groupUpAccept=True)
        incoming_superGroupup = incoming_groupup.filter(isSuperGroupup=True).exclude(
            groupUpAccept=True
        )

        # Exclude groupups which the group have already requested or accepted
        outgoing_groupids = [g.group2.id for g in outgoing_groupup]
        accepted_incoming_groupids = [g.group1.id for g in accepted_incoming_groupup]
        queryset = queryset.exclude(pk__in=outgoing_groupids)
        queryset = queryset.exclude(pk__in=accepted_incoming_groupids)

        interests = request.query_params.get("interests")
        if interests is not None and len(interests):
            interests = interests.split(",")
            queryset = [
                q
                for q in queryset
                if any(
                    len(q.interests.filter(name__iexact=interest))
                    for interest in interests
                )
            ]

        location = request.query_params.get("location")
        if location is not None:
            queryset = [q for q in queryset if location.lower() in q.location.lower()]

        meetingDate = request.query_params.get("meetingDate")
        if meetingDate is not None:
            date = datetime.strptime(meetingDate, "%Y-%m-%d")
            queryset = [
                q
                for q in queryset
                if q.meetingDate and date.weekday() == q.meetingDate.weekday()
            ]

        ageMin = request.query_params.get("ageMin")
        if ageMin is not None:
            ageMin = int(ageMin)
            queryset = [
                q
                for q in queryset
                if ageMin
                <= min(
                    map(
                        lambda bd: datetime.today().year - bd.year,
                        q.members.all().values_list("birthdate", flat=True),
                    )
                )
            ]

        ageMax = request.query_params.get("ageMax")
        if ageMax is not None:
            ageMax = int(ageMax)
            queryset = [
                q
                for q in queryset
                if ageMax
                >= max(
                    map(
                        lambda bd: datetime.today().year - bd.year,
                        q.members.all().values_list("birthdate", flat=True),
                    )
                )
            ]

        incoming_superGroupup_groups = [gu.group1.id for gu in incoming_superGroupup]
        list(queryset).sort(key=lambda ig: ig.id in incoming_superGroupup_groups)

        return Response(InterestGroupSerializer(queryset, many=True).data, status=200)


class InterestViewSet(viewsets.ModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupUpViewSet(viewsets.ModelViewSet):
    queryset = GroupUp.objects.all()
    serializer_class = GroupUpSerializer
    permission_classes = [permissions.IsAuthenticated, UserAccessToMatchPermission]

    @action(
        methods=["get"],
        detail=False,
        url_path="getGroupUps",
        url_name="getGroupUps",
    )
    def getGroupUps(self, request, pk=None):
        user_groups = InterestGroup.objects.filter(members__in=[request.user])
        groupUps = GroupUp.objects.filter(
            Q(group1__in=user_groups) | Q(group2__in=user_groups)
        )
        groupData = {
            id: InterestGroupSerializer(InterestGroup.objects.get(id=id)).data
            for id in list(
                set(
                    [
                        j
                        for sub in [
                            [group.group1.id, group.group2.id] for group in groupUps
                        ]
                        for j in sub
                    ]
                )
            )
        }
        matches = {
            groupUp.id: {
                "group1": groupData[groupUp.group1.id],
                "group2": groupData[groupUp.group2.id],
            }
            for groupUp in groupUps
        }
        return Response(matches, status=200)
