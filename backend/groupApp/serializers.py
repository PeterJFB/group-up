from rest_framework import serializers
from .models import InterestGroup, Interest, GroupMatch
from authorization.serializers import UserSerializer


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


class InterestGroupSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True)
    # members = UserSerializer(many=True)
    # matches = GroupMatchSerializer(many=True)

    class Meta:
        model = InterestGroup
        fields = [
            "id",
            "name",
            "description",
            "location",
            "quote",
            "members",
            "interests",
            "date",
            # "matches",
            # "sentLikes",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["groupAdmin"] = request.user

        interests = validated_data.pop("interests")
        interestGroup = InterestGroup.objects.create(**validated_data)

        def toId(interest):
            obj, created = Interest.objects.get_or_create(
                name=interest["name"], description=interest["description"]
            )
            return obj.id

        interestArr = list(map(lambda i: toId(i), interests))

        interestGroup.interests.set(interestArr)
        interestGroup.members.set([request.user])
        interestGroup.save()
        return interestGroup

    def update(self, instance, validated_data):
        # TODO: fix update of interests
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.date = validated_data.get("date", instance.date)
        instance.location = validated_data.get("location", instance.location)
        instance.quote = validated_data.get("quote", instance.quote)

        if "members" in validated_data:
            instance.members.set(validated_data.get("members"))
        # if "matches" in validated_data:
        #     instance.matches.set(validated_data.get("matches"))
        # if "sentLikes" in validated_data:
        #     instance.sentLikes.set(validated_data.get("sentLikes"))
        if "interests" in validated_data:
            instance.interests.set(validated_data.get("interests"))
        instance.save()
        return instance
