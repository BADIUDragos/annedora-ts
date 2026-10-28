from django.core.exceptions import ValidationError


def validate_username(value):
    # isalpha() accepts accented letters. The previous ASCII range did not.
    if (
        not value
        or any(not character.isalpha() and character != ' ' for character in value)
    ):
        raise ValidationError(
            'Name field must contain only alphabetic characters.'
        )
