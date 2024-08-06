from rest_framework import serializers


class ContactFormSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    address = serializers.CharField(max_length=255)
    surfaceArea = serializers.CharField(max_length=100)
    produce = serializers.CharField(max_length=255)
