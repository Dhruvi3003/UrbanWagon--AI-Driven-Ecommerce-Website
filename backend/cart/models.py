from django.db import models
from accounts.models import User
from products.models import Product
from django.core.validators import MinValueValidator
from decimal import Decimal

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    added_at = models.DateTimeField(auto_now_add=True)
    size = models.CharField(max_length=3)
    
    class Meta:
        unique_together = ['user', 'product']
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    @property
    def total_price(self):
        return self.price * self.quantity