from rest_framework import serializers
from base.Product.models import Product, Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'name', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        exclude = ['user', 'created_at']

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        instance = super().create(validated_data)
        if image:
            instance.image = image
            instance.save()
        return instance

    def update(self, instance, validated_data):
        image = validated_data.pop('image', None)
        instance = super().update(instance, validated_data)
        if image:
            instance.image = image
        instance.save()
        return instance
