from rest_framework import serializers
from core.models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    """
    The UserSerializer class is a ModelSerializer subclass that defines how the User should be serialized
    The password field is marked as write-only, meaning that it
    will not be included in the serialized representation of the User instance.

    The create() method is overridden to set the password of the user to the value of the password
    field.
    """

    class Meta:
        model = User
        fields = ("id", "username", "password", "email", "first_name", "last_name")
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        user.set_password(validated_data["password"])
        user.save()

        return user
