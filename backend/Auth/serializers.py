from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers

from Auth.validators import validate_username


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[validate_username])
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['first_name', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already in use.')
        return value

    def create(self, validated_data):
        user = User.objects.create(
            first_name=validated_data['username'],
            username=validated_data['email'],
            email=validated_data['email'],
            password=make_password(validated_data['password'])
        )
        return user
