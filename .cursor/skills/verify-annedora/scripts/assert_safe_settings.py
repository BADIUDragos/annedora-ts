#!/usr/bin/env python3
"""Fail if the verification process still has live mail, Stripe, or Cloudinary settings.

Launch exports blank credentials before Django starts. python-dotenv's
load_dotenv() does not override variables that are already set, including
blanks. This reads the settings Django actually loaded.
"""

import os
import sys

BACKEND_DIR = os.environ.get("VERIFY_BACKEND_DIR") or os.getcwd()
sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django

django.setup()

from django.conf import settings
import cloudinary

LOCMEM = "django.core.mail.backends.locmem.EmailBackend"
BLANK_NAMES = (
    "STRIPE_SECRET",
    "STRIPE_PUBLIC",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "EMAIL_HOST",
    "EMAIL_HOST_USER",
    "EMAIL_HOST_PASSWORD",
)
REAL_MARKERS = (
    "sk_live_",
    "sk_test_",
    "rk_live_",
    "rk_test_",
    "pk_live_",
    "pk_test_",
    "smtp.",
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
    if marker(backend):
        problems.append("EMAIL_BACKEND looks like a live transport")

    env_values = {name: os.environ.get(name) for name in BLANK_NAMES}
    env_values["STRIPE_SECRET"] = settings.STRIPE_SECRET
    env_values["EMAIL_HOST"] = settings.EMAIL_HOST
    env_values["EMAIL_HOST_USER"] = settings.EMAIL_HOST_USER
    env_values["EMAIL_HOST_PASSWORD"] = settings.EMAIL_HOST_PASSWORD

    config = cloudinary.config()
    env_values["CLOUDINARY_CLOUD_NAME"] = getattr(config, "cloud_name", None)
    env_values["CLOUDINARY_API_KEY"] = getattr(config, "api_key", None)
    env_values["CLOUDINARY_API_SECRET"] = getattr(config, "api_secret", None)

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
