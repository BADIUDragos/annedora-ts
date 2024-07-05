from django.urls import path
from base.Product.views import ProductListCreateView, ProductRetrieveUpdateDestroyView, create_product_review

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductRetrieveUpdateDestroyView.as_view(), name='product-update-delete'),
    path('review', create_product_review, name='create-product-review'),
]
