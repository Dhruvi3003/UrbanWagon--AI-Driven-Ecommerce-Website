from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem
from decimal import Decimal
from products.models import Product
from rest_framework import generics
import razorpay
import hmac
import hashlib
from django.conf import settings

class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    # def post(self, request):
    #     user = request.user
    #     cart_items = CartItem.objects.filter(user=user)
    #     if not cart_items.exists():
    #         return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    #     address = request.data.get('address')
    #     payment_method = request.data.get('payment_method')

    #     if not address or not payment_method:
    #         return Response({"error": "Address and payment method are required"}, status=status.HTTP_400_BAD_REQUEST)

    #     total_amount = sum(item.price * item.quantity for item in cart_items)

    #     order = Order.objects.create(
    #         user=user,
    #         address=address,
    #         payment_method=payment_method,
    #         total_amount=total_amount,
    #     )

    #     for item in cart_items:
    #         OrderItem.objects.create(
    #             order=order,
    #             product=item.product,
    #             quantity=item.quantity,
    #             price=item.price
    #         )

    #     cart_items.delete()

    #     serializer = OrderSerializer(order)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    def post(self, request):
        user = request.user
        items = request.data.get('items')
        address = request.data.get('address')
        payment_method = request.data.get('payment_method')
        payment_verified = request.data.get('payment_verified', False)  # <-- add this line

        print("Received items:", items)

        if not items or not address or not payment_method:
            return Response({"error": "Missing items, address, or payment method"}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = 0

        # Calculate total amount and create order items
        for item in items:
            try:
                product = Product.objects.get(id=item['product'])
                total_amount += float(product.price) * int(item['quantity'])
            except Product.DoesNotExist:
                return Response({"error": f"Product with id {item['product']} does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the order
        order = Order.objects.create(
            user=user,
            address=address,
            payment_method=payment_method,
            payment_verified=payment_verified,  # <-- set this field
            total_amount=Decimal(total_amount),
        )

        # Add items to the order
        for item in items:
            product = Product.objects.get(id=item['product'])  # safe now
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price=product.price,
                size=item.get('size', '')  # optional field
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # def post(self, request):
    #     user = request.user
    #     items = request.data.get('items')
    #     address = request.data.get('address')
    #     payment_method = request.data.get('payment_method')
    #     print("Received items:", items)

    #     if not items or not address or not payment_method:
    #         return Response({"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)

    #     total_amount = sum(
    #         Product.objects.get(id=item['id']).price * item['quantity'] for item in items
    #     )

    #     order = Order.objects.create(
    #         user=user,
    #         address=address,
    #         payment_method=payment_method,
    #         total_amount=total_amount,
    #     )

    #     for item in items:
    #         OrderItem.objects.create(
    #             order=order,
    #             id=item['id'],
    #             quantity=item['quantity'],
    #             price=Product.objects.get(id=item['id']).price
    #         )

    #     serializer = OrderSerializer(order)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)


    
    
class AllOrdersView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)



class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

class UpdateOrderStatusView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("orderId")
        new_status = request.data.get("status")

        if not order_id or not new_status:
            return Response({"error": "Missing orderId or status"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id)
            order.status = new_status
            order.save()

            return Response({"success": True, "message": "Order status updated"}, status=status.HTTP_200_OK)
        
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

class RazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        currency = request.data.get('currency', 'INR')
        receipt = request.data.get('receipt', 'order_rcptid_11')
        if not amount:
            return Response({'error': 'Amount required'}, status=400)
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        order_data = {
            'amount': int(float(amount) * 100),  # Razorpay expects paise
            'currency': currency,
            'receipt': receipt,
            'payment_capture': 1
        }
        order = client.order.create(order_data)
        return Response(order)

class RazorpayVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            (razorpay_order_id + "|" + razorpay_payment_id).encode(),
            hashlib.sha256
        ).hexdigest()

        if generated_signature == razorpay_signature:
            return Response({'status': 'Payment verified'}, status=200)
        else:
            return Response({'status': 'Payment verification failed'}, status=400)

class DeleteOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            order.delete()
            return Response({"success": True, "message": "Order deleted"}, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)