from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id', 'user', 'product', 'quantity',
            'price', 'added_at', 'total_price','size'
        ]
        read_only_fields = ['id', 'added_at', 'total_price']
