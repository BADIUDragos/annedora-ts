from django.core.exceptions import ValidationError
import re


def validate_username(value):
    if not re.match(r'^[a-zA-Z ]+$', value):
        raise ValidationError(
            'Name field must contain only alphabetic characters.'
        )
