from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class UserDetailPermissionTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.owner = User.objects.create_user(
            username='owner@example.com',
            email='owner@example.com',
            password='password123',
            first_name='Owner',
        )
        cls.other = User.objects.create_user(
            username='other@example.com',
            email='other@example.com',
            password='password123',
        )
        cls.staff = User.objects.create_user(
            username='staff@example.com',
            email='staff@example.com',
            password='password123',
            is_staff=True,
        )

    def test_non_staff_can_read_their_own_record(self):
        self.client.force_authenticate(self.owner)
        response = self.client.get(f'/api/base/users/{self.owner.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'owner@example.com')

    def test_non_staff_cannot_read_someone_else(self):
        self.client.force_authenticate(self.other)
        response = self.client.get(f'/api/base/users/{self.owner.id}/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_read_another_user(self):
        self.client.force_authenticate(self.staff)
        response = self.client.get(f'/api/base/users/{self.owner.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.owner.id)
