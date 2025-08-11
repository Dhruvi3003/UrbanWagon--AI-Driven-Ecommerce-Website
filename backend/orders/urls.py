from django.urls import path
from .views import OrderListCreateView, OrderDetailView, AllOrdersView, UpdateOrderStatusView
from .views import RazorpayOrderView, RazorpayVerifyView
from .views import DeleteOrderView  # add this import

urlpatterns = [
    path('all/', AllOrdersView.as_view(), name='all-orders'),
    path('', OrderListCreateView.as_view(), name='order-list-create'),
    path('<uuid:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('<uuid:order_id>/delete/', DeleteOrderView.as_view(), name='order-delete'),  # add this line
    path('status/', UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('razorpay/', RazorpayOrderView.as_view(), name='razorpay-order'),
    path('verifyrazorpay/', RazorpayVerifyView.as_view(), name='razorpay-verify'),
]
