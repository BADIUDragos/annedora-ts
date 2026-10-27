from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from base.Product.models import Product


class CreateProductReviewTests(TestCase):
    def test_logged_in_user_can_post_a_review(self):
        user = User.objects.create_user(
            username="reviewer",
            password="secret",
            first_name="Ada",
        )
        product = Product.objects.create(name="Honey", price="10.00")
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/base/product/review",
            {"id": product.id, "rating": 4, "comment": "Solid jar."},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        product.refresh_from_db()
        self.assertEqual(product.num_reviews, 1)
        self.assertEqual(product.rating, 4)
