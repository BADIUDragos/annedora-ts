#!/usr/bin/env python3
"""Seed a disposable Annedora database for verification.

Dev-only accounts. These are not production credentials.
"""

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal

# Launch runs this file from backend/ so Django can import `backend.settings`.
# The script path would otherwise take sys.path[0] and hide that package.
sys.path.insert(0, os.getcwd())

import django

MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

# Fixed instants so the Created column does not depend on the clock.
# Noon UTC stays on the same calendar day in the UTC browser used by the drive.
ANCHOR = datetime(2026, 10, 26, 12, 0, tzinfo=timezone.utc)
ADMIN_JOINED = datetime(2024, 1, 1, 12, 0, tzinfo=timezone.utc)
SEEDED_USER_COUNT = 26


def display_date(value):
    value = value.astimezone(timezone.utc)
    day = value.day
    if 11 <= (day % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    return f"{MONTHS[value.month - 1]} {day}{suffix}, {value.year}"


def require_env(name):
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"missing {name}")
    return value


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    django.setup()

    from django.contrib.auth.models import User

    from base.Order.models import Order, OrderItem, ShippingAddress
    from base.Product.models import Product

    if User.objects.exists():
        raise SystemExit(
            "database already has users; launch a new state directory instead of reseeding"
        )

    admin_email = require_env("VERIFY_ADMIN_EMAIL")
    admin_password = require_env("VERIFY_ADMIN_PASSWORD")
    admin_name = require_env("VERIFY_ADMIN_NAME")

    assert display_date(ANCHOR) == "October 26th, 2026"
    assert display_date(ANCHOR - timedelta(days=25)) == "October 1st, 2026"
    assert display_date(ADMIN_JOINED) == "January 1st, 2024"

    admin = User.objects.create_superuser(
        username=admin_email,
        email=admin_email,
        password=admin_password,
        first_name=admin_name,
    )
    admin.date_joined = ADMIN_JOINED
    admin.save(update_fields=["date_joined"])

    # User 01 sorts first only when name and email use case-insensitive order.
    # User 02 sorts first on SQLite's binary collation, which puts uppercase first.
    special_accounts = {
        1: ("aaron lower", "aaron.lower@example.test"),
        2: ("Bob Mixed", "Bob.Mixed@example.test"),
    }

    seeded = []
    for index in range(1, SEEDED_USER_COUNT + 1):
        joined = ANCHOR - timedelta(days=SEEDED_USER_COUNT - index)
        first_name, email = special_accounts.get(
            index,
            (f"Seeded User {index:02d}", f"seeded-user-{index:02d}@example.test"),
        )
        user = User.objects.create_user(
            username=email,
            email=email,
            password="seeded-user-dev-only",
            first_name=first_name,
        )
        user.date_joined = joined
        user.is_staff = False
        user.save()
        seeded.append(user)

    newest_first = list(reversed(seeded))
    page_size = 25
    page2 = newest_first[page_size:]
    # Admin joined in 2024, so newest-first puts them after every seeded user.
    page2_with_admin = page2 + [admin]

    products_seeded = False
    orders_seeded = False
    product_names = []
    try:
        honey = Product.objects.create(
            user=admin,
            name="Clover Honey",
            french_name="Miel de trefle",
            category="honey",
            description="Light honey seeded for verification.",
            french_description="Miel clair pour la verification.",
            price=Decimal("12.00"),
            count_in_stock=4,
            rating=Decimal("5.00"),
            num_reviews=0,
        )
        Product.objects.create(
            user=admin,
            name="Beeswax Candle",
            french_name="Bougie de cire",
            category="candles",
            description="Candle seeded for verification.",
            french_description="Bougie pour la verification.",
            price=Decimal("8.50"),
            count_in_stock=2,
            rating=Decimal("0.00"),
            num_reviews=0,
        )
        products_seeded = True
        product_names = ["Clover Honey", "Beeswax Candle"]

        buyer = seeded[0]
        order = Order.objects.create(
            user=buyer,
            subtotal=Decimal("12.00"),
            tax_price=Decimal("0.00"),
            shipping_price=Decimal("15.00"),
            total_price=Decimal("27.00"),
            is_paid=True,
            paid_at=datetime(2026, 10, 20, 12, 0, tzinfo=timezone.utc),
            is_shipped=False,
            is_delivered=False,
            order_option="Shipping",
        )
        OrderItem.objects.create(
            product=honey,
            order=order,
            name="Clover Honey",
            qty=1,
            price=Decimal("12.00"),
        )
        ShippingAddress.objects.create(
            order=order,
            address="1 Verification Lane",
            city="Montreal",
            postal_code="H0H 0H0",
            country="Canada",
        )
        orders_seeded = True
    except Exception as exc:
        # Users are enough to drive the admin list. Product and order journeys
        # read products_seeded / orders_seeded and fail closed when this is false.
        print(f"product or order seed failed: {exc}", file=sys.stderr)
        products_seeded = False
        orders_seeded = False
        try:
            products_seeded = Product.objects.exists()
        except Exception:
            products_seeded = False

    manifest = {
        "admin_email": admin_email,
        "admin_name": admin_name,
        "count": User.objects.count(),
        "newest_name": "Seeded User 26",
        "newest_email": "seeded-user-26@example.test",
        "newest_created": "October 26th, 2026",
        "page1_last_name": "Bob Mixed",
        "page1_last_created": "October 2nd, 2026",
        "page2_names": ["aaron lower", admin_name],
        "page2_emails": ["aaron.lower@example.test", admin_email],
        "page2_created": ["October 1st, 2026", "January 1st, 2024"],
        "oldest_name": admin_name,
        "oldest_email": admin_email,
        "oldest_created": "January 1st, 2024",
        "products_seeded": products_seeded,
        "product_names": product_names,
        "orders_seeded": orders_seeded,
        "order_customer": "aaron lower",
    }

    if manifest["count"] != SEEDED_USER_COUNT + 1:
        raise SystemExit(f"expected 27 users, found {manifest['count']}")
    if [user.first_name for user in page2_with_admin] != manifest["page2_names"]:
        raise SystemExit("page 2 names did not match the seed contract")

    manifest_path = require_env("VERIFY_MANIFEST")
    with open(manifest_path, "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=2)
        handle.write("\n")
    print(f"seeded {manifest['count']} users")
    print(f"manifest {manifest_path}")


if __name__ == "__main__":
    main()
