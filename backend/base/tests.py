from types import SimpleNamespace

from django.template.loader import render_to_string
from django.test import SimpleTestCase

from base.Order.models import ShippingAddress


class OwnerNewOrderEmailTests(SimpleTestCase):
    def test_renders_shipping_postal_code(self):
        order = SimpleNamespace(shippingaddress=ShippingAddress(postal_code="H2X 1Y4"))
        html = render_to_string("NewOrderConfirmationToShip.html", {
            "user": SimpleNamespace(), "order": order, "order_items": [],
        })
        self.assertIn("H2X 1Y4", html)
