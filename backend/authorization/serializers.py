from rest_framework import serializers
from core.models import User


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
        fields = ("username", "password", "email", "id")

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()

        return user
