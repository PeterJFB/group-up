from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

# The UserSerializer class is a ModelSerializer subclass that defines the fields that should be
# included in the serialized representation of a User instance. The fields that are included are the
# username, email, and password fields. The password field is marked as write-only, meaning that it
# will not be included in the serialized representation of the User instance.
#
# The create() method is overridden to set the password of the user to the value of the password
# field.
#
# The Meta class is also overridden to specify the model that the UserSerializer should be based on
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    # password = serializers.CharField(write_only=True, required=True)

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
