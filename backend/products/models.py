from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Men', 'Men'),
        ('Women', 'Women'),
        ('Kids', 'Kids'),
    ]
    
    SUBCATEGORY_CHOICES = [
        ('TopWear', 'Top Wear'),
        ('BottomWear', 'Bottom Wear'),
        ('WinterWear', 'Winter Wear'),
        ('Combo', 'Outfits'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    # price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    # size = models.CharField(max_length=3, choices=SIZE_CHOICES)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    sub_category = models.CharField(max_length=15, choices=SUBCATEGORY_CHOICES)
    
    # image1 = models.ImageField(upload_to='products/', null=True, blank=True)
    # image2 = models.ImageField(upload_to='products/', null=True, blank=True)
    # image3 = models.ImageField(upload_to='products/', null=True, blank=True)
    # image4 = models.ImageField(upload_to='products/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    
    best_seller = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

class ProductVariant(models.Model):
    SIZE_CHOICES = [
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=3, choices=SIZE_CHOICES)
    

    image1 = models.ImageField(upload_to='products/', null=True, blank=True)
    image2 = models.ImageField(upload_to='products/', null=True, blank=True)
    image3 = models.ImageField(upload_to='products/', null=True, blank=True)
    image4 = models.ImageField(upload_to='products/', null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} - {self.size}"