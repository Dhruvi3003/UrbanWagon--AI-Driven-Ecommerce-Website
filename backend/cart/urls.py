from django.urls import path
from .views import CartItemListCreateView, CartItemDetailView, ClearCartView

urlpatterns = [
    path('', CartItemListCreateView.as_view(), name='cart-list-create'),
    path('<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('clear/', ClearCartView.as_view(), name='clear-cart'),
]
