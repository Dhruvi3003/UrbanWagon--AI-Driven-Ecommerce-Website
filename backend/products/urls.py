from django.urls import path
from .views import AddProductView, ProductListView, ProductDetailView, RemoveProductView
from .views import UpdateProductView  # <-- add this

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('add/', AddProductView.as_view(), name='add-product'),
    path('remove/<int:pk>/', RemoveProductView.as_view(), name='remove-product'),
    path('update/<int:pk>/', UpdateProductView.as_view(), name='update-product'),  # <-- add this
]
