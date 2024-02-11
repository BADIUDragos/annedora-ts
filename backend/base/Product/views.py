from base.Product.models import Product
from base.Product.serializer import ProductSerializer
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated
from rest_framework import generics
from rest_framework_simplejwt.authentication import JWTAuthentication


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (DjangoModelPermissions, IsAuthenticated)
    authentication_classes = JWTAuthentication


class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (DjangoModelPermissions, IsAuthenticated)
    authentication_classes = JWTAuthentication
