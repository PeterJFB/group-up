from rest_framework import serializers
from .models import InterestGroup, Interest, GroupMatch


class InterestGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestGroup
        fields = [
            "name",
            "description",
            "members",
            "groupAdmin",
            "interests",
            "matches",
            "sentLikes",
            "meetingDate",
            "location",
            "quote",
        ]

    def create(self, validated_data):
        interestGroup = InterestGroup.objects.create(**validated_data)
        interestGroup.save()
        return interestGroup

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.groupAdmin = validated_data.get("groupAdmin", instance.groupAdmin)

        instance.meetingDate = validated_data.get("meetingDate", instance.meetingDate)
        instance.location = validated_data.get("location", instance.location)
        instance.quote = validated_data.get("quote", instance.quote)

        if "members" in validated_data:
            instance.members.set(validated_data.get("members"))
        if "matches" in validated_data:
            instance.matches.set(validated_data.get("matches"))
        if "sentLikes" in validated_data:
            instance.sentLikes.set(validated_data.get("sentLikes"))
        if "interests" in validated_data:
            instance.interests.set(validated_data.get("interests"))
        instance.save()
        return instance


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ["name", "description"]

    def create(self, validated_data):
        interest = Interest.objects.create(**validated_data)
        return interest

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.save()
        return instance


class GroupMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMatch
        fields = ["group1", "group2"]

    def create(self, validated_data):
        groupMatch = GroupMatch.objects.create(**validated_data)
        return groupMatch

    def update(self, instance, validated_data):
        instance.group1 = validated_data.get("group1", instance.group1)
        instance.group2 = validated_data.get("group2", instance.group2)
        instance.save()
        return instance
