from rest_framework import serializers
from django.contrib.auth.models import User

from Auth.validators import validate_username


class UserSerializer(serializers.ModelSerializer):
    isSuperuser = serializers.BooleanField(source='is_superuser', read_only=True)
    isStaff = serializers.BooleanField(source='is_staff')
    permissions = serializers.SerializerMethodField()

    first_name = serializers.CharField(validators=[validate_username])

    class Meta:
        model = User
        fields = ['id', 'first_name', 'email', 'isSuperuser', 'isStaff', 'permissions']

    def get_permissions(self, obj):
        return [perm.codename for perm in obj.user_permissions.all()]
