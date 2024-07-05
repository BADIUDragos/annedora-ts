from rest_framework.decorators import api_view, permission_classes

from base.Product.models import Product, Review
from base.Product.serializer import ProductSerializer
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated, IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()


class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        elif self.request.method == 'DELETE':
            return [IsAuthenticated(), IsAdminUser()]
        else:
            return [IsAuthenticated()]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product_review(request, id):
    user = request.user
    product = Product.objects.get(id=id)
    data = request.data

    already_exists = product.review_set.filter(user=user).exists()

    if already_exists:
        content = {'detail': "You've already reviewed this product"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # No rating ?

    elif data['rating'] == 0:
        content = {'detail': "Please select a rating"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # Create review
    else:
        Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )

        reviews = product.review_set.all()
        product.num_reviews = len(reviews)

        total = 0
        for review in reviews:
            total += review.rating
        product.rating = total / len(reviews)
        product.save()

        return Response({'detail': 'Review was created'})
