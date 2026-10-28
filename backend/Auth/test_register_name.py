from django.contrib.auth.models import User
from django.test import TestCase

from Auth.serializers import RegisterSerializer
from base.User.serializers import UserSerializer


class RegisterNameTests(TestCase):
    def test_accented_name_can_register(self):
        serializer = RegisterSerializer(data={
            'username': 'Élise',
            'email': 'elise@example.com',
            'password': 'password123',
        })

        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.first_name, 'Élise')
        self.assertEqual(user.email, 'elise@example.com')

    def test_spaced_ascii_name_can_register(self):
        serializer = RegisterSerializer(data={
            'username': 'Jacques Tremblay',
            'email': 'jacques@example.com',
            'password': 'password123',
        })

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_digits_are_rejected(self):
        serializer = RegisterSerializer(data={
            'username': 'Anne2',
            'email': 'anne2@example.com',
            'password': 'password123',
        })

        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_admin_edit_accepts_an_accented_name(self):
        user = User.objects.create_user(
            username='anne@example.com',
            email='anne@example.com',
            password='password123',
            first_name='Anne',
        )
        serializer = UserSerializer(user, data={
            'first_name': 'Élise',
            'email': 'anne@example.com',
            'isStaff': False,
        })

        self.assertTrue(serializer.is_valid(), serializer.errors)
