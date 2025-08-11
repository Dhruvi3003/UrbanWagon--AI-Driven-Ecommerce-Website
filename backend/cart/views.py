# cart/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import CartItem
from products.models import Product
from .serializers import CartItemSerializer

class CartItemListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'price': product.price, 'quantity': quantity, "size":request.data.get('size')}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartItemDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        quantity = int(request.data.get('quantity', cart_item.quantity))
        cart_item.quantity = quantity
        cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, user=request.user)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({"message": "Cart cleared"}, status=204)
