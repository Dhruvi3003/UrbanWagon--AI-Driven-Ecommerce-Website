from rest_framework import serializers
from .models import OrderItem, Order
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'product', 'quantity',
            'price', 'total_price', 'size'
        ]
        read_only_fields = ['id', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'address', 'payment_method',
            'payment_verified', 'status', 'total_amount',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'payment_verified']