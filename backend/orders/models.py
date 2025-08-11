from django.db import models
from accounts.models import User
from products.models import Product
from django.core.validators import MinValueValidator
import uuid
from decimal import Decimal

class Order(models.Model):
    STATUS_CHOICES = [
        ('placed', 'Order Placed'),
        ('packing', 'Packing'),
        ('shipped', 'Shipped'),
        ('out_of_delievery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('returned', 'Returned')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    
    address = models.TextField(max_length=255)
    
    PAYMENT_CHOICES = (
        ('COD', 'COD'),
        ('razorpay', 'razorpay'),
    )

    payment_method = models.CharField(max_length=30, choices=PAYMENT_CHOICES)
    payment_verified = models.BooleanField(default=False)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='placed')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.id} - {self.user.email}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=10, null=True, blank=True)
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    @property
    def total_price(self):
        return self.price * self.quantity