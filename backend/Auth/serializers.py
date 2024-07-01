from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers

from Auth.validators import validate_username


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[validate_username])

    class Meta:
        model = User
        fields = ['first_name', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create(
            first_name=validated_data['username'],
            username=validated_data['email'],
            email=validated_data['email'],
            password=make_password(validated_data['password'])
        )
        return user
