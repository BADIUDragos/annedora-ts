from django.urls import path
from base.Order import views


urlpatterns = [
    path('', views.get_orders, name='orders'),

    path('add/', views.create_order, name='orders-add'),
    path('myorders/', views.get_my_orders, name='my-orders'),
    path('total/', views.get_prices, name='get-prices'),
    path('stripe/', views.get_stripe_info, name='get-stripe-info'),
    path('payment-intent/', views.create_payment_intent, name='create-payment-intent'),

    path('<str:pk>/', views.get_order_by_id, name='user-order'),
    path('<str:pk>/shipped/', views.update_order_to_shipped, name='shipped-order'),
    path('<str:pk>/delivered/', views.update_order_to_delivered, name='delivered-order'),
]
