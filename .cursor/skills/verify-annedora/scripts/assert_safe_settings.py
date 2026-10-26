#!/usr/bin/env python3
"""Fail if the verification process still has live mail, Stripe, or Cloudinary settings.

Launch exports blank credentials and fixed Cloudinary placeholders before
Django starts. python-dotenv's load_dotenv() does not override variables that
are already set, including blanks. This reads the settings Django actually loaded.
"""

import os
import sys

BACKEND_DIR = os.environ.get("VERIFY_BACKEND_DIR") or os.getcwd()
sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django

django.setup()

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.files.storage import default_storage
import cloudinary

LOCMEM = "django.core.mail.backends.locmem.EmailBackend"
PLACEHOLDER = "verify-annedora-placeholder"
BLANK_NAMES = (
    "STRIPE_SECRET",
    "STRIPE_PUBLIC",
    "EMAIL_HOST",
    "EMAIL_HOST_USER",
    "EMAIL_HOST_PASSWORD",
)
CLOUDINARY_FIELDS = {
    "CLOUDINARY_CLOUD_NAME": "cloud_name",
    "CLOUDINARY_API_KEY": "api_key",
    "CLOUDINARY_API_SECRET": "api_secret",
}
REAL_MARKERS = (
    "sk_live_",
    "sk_test_",
    "rk_live_",
    "rk_test_",
    "pk_live_",
    "pk_test_",
)


def blank(value):
    if value is None:
        return True
    return str(value).strip() == ""


def marker(value):
    text = "" if value is None else str(value).lower()
    return next((item for item in REAL_MARKERS if item in text), "")


def main():
    problems = []
    lines = []

    backend = settings.EMAIL_BACKEND
    lines.append(f"EMAIL_BACKEND={backend}")
    if backend != LOCMEM:
        problems.append("EMAIL_BACKEND is not the locmem backend")

    env_values = {name: os.environ.get(name) for name in BLANK_NAMES}
    env_values["STRIPE_SECRET"] = settings.STRIPE_SECRET
    env_values["EMAIL_HOST"] = settings.EMAIL_HOST
    env_values["EMAIL_HOST_USER"] = settings.EMAIL_HOST_USER
    env_values["EMAIL_HOST_PASSWORD"] = settings.EMAIL_HOST_PASSWORD

    config = cloudinary.config()
    for name, attr in CLOUDINARY_FIELDS.items():
        configured = getattr(config, attr, None)
        from_env = os.environ.get(name)
        if configured == PLACEHOLDER and from_env == PLACEHOLDER:
            lines.append(f"{name}=placeholder")
        else:
            problems.append(f"{name} is not the verification placeholder")
            lines.append(f"{name}=mismatch")
        found = marker(configured) or marker(from_env)
        if found:
            problems.append(f"{name} matches {found}")

    cloudinary_url = os.environ.get("CLOUDINARY_URL")
    if cloudinary_url is None:
        problems.append("CLOUDINARY_URL is unset")
        lines.append("CLOUDINARY_URL=unset")
    elif str(cloudinary_url).strip() != "":
        problems.append(f"CLOUDINARY_URL is set (length {len(str(cloudinary_url).strip())})")
        lines.append("CLOUDINARY_URL=set")
    else:
        lines.append("CLOUDINARY_URL=blank")

    import socket

    connects = []
    original_connect = socket.socket.connect

    def record_connect(self, address):
        connects.append(address)
        raise RuntimeError("outbound socket")

    socket.socket.connect = record_connect
    image_url = ""
    try:
        image_url = default_storage.url("/placeholder.png")
    except ImproperlyConfigured:
        problems.append("default storage is not configured")
    except RuntimeError:
        problems.append("storage url opened a socket")
    finally:
        socket.socket.connect = original_connect
    lines.append(f"STORAGE_URL={image_url}")
    if connects:
        problems.append(f"storage url attempted {len(connects)} connections")
    if image_url and PLACEHOLDER not in image_url:
        problems.append("storage url does not use the placeholder cloud")
    if "api.cloudinary.com" in image_url:
        problems.append("storage url points at the Cloudinary API host")

    for name in BLANK_NAMES:
        value = env_values[name]
        if blank(value):
            lines.append(f"{name}=blank")
            continue
        found = marker(value)
        suffix = f", matches {found}" if found else ""
        problems.append(f"{name} is set (length {len(str(value).strip())}{suffix})")
        lines.append(f"{name}=set")

    engine = settings.DATABASES["default"]["ENGINE"]
    name = settings.DATABASES["default"]["NAME"]
    lines.append(f"DATABASE_ENGINE={engine}")
    lines.append(f"DATABASE_NAME={name}")
    expected_engine = os.environ.get("VERIFY_EXPECT_DB_ENGINE", "")
    expected_name = os.environ.get("VERIFY_EXPECT_DB_NAME", "")
    if expected_engine and engine != expected_engine:
        problems.append(f"database engine is {engine}, expected {expected_engine}")
    if expected_name and str(name) != expected_name:
        problems.append("database name is not the verification database")

    report = "\n".join(lines) + "\n"
    report_path = os.environ.get("VERIFY_SAFE_SETTINGS_REPORT", "")
    if report_path:
        with open(report_path, "w", encoding="utf-8") as handle:
            handle.write(report)
    sys.stdout.write(report)
    if problems:
        print("safe-settings: fail", file=sys.stderr)
        for problem in problems:
            print(f"safe-settings: {problem}", file=sys.stderr)
        return 1
    print("safe-settings: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
