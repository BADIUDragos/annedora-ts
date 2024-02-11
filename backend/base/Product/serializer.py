from rest_framework import serializers
from base.Product.models import Product


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'
        
    def create(self, validated_data):
        image = validated_data.pop('image', None)
        instance = super().create(validated_data)
        if image:
            instance.image.save(image.name, image)
        return instance




