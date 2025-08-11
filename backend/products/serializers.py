from rest_framework import serializers
from .models import Product, ProductVariant

# serializers.py
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'image1', 'image2', 'image3', 'image4']


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'sub_category', 'best_seller', 'variants', 'price']
