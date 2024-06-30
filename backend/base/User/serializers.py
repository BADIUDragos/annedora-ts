from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    isSuperuser = serializers.BooleanField(source='is_superuser')
    isStaff = serializers.BooleanField(source='is_staff')
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'isSuperuser', 'isStaff', 'permissions']

    def get_permissions(self, obj):
        return [perm.codename for perm in obj.user_permissions.all()]
