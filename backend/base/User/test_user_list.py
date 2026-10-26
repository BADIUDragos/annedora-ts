from datetime import datetime, timedelta, timezone as datetime_timezone

from django.contrib.auth.models import User
from django.db import connection
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.test import APITestCase

USER_LIST_URL = '/api/base/users/'


class UserListTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.users = []
        for index in range(12):
            user = User.objects.create_user(
                username=f'user{index:02d}',
                email=f'user{index:02d}@example.com',
                password='password123',
                first_name=f'Name {index:02d}',
                is_staff=(index % 2 == 0),
            )
            User.objects.filter(pk=user.pk).update(
                date_joined=datetime(2020, 1, 1, tzinfo=datetime_timezone.utc) + timedelta(days=index)
            )
            user.refresh_from_db()
            cls.users.append(user)

    def setUp(self):
        self.client.force_authenticate(self.users[0])

    def test_anonymous_and_non_staff_cannot_list_users(self):
        self.client.force_authenticate(user=None)
        anonymous = self.client.get(USER_LIST_URL)
        self.assertEqual(anonymous.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(self.users[1])
        self.assertFalse(self.users[1].is_staff)
        forbidden = self.client.get(USER_LIST_URL)
        self.assertEqual(forbidden.status_code, status.HTTP_403_FORBIDDEN)

    def test_default_page_size_and_newest_created_date_first(self):
        response = self.client.get(USER_LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 12)
        self.assertEqual(response.data['page'], 1)
        self.assertEqual(response.data['page_size'], 25)
        self.assertEqual(
            [row['first_name'] for row in response.data['results']],
            [f'Name {index:02d}' for index in range(11, -1, -1)],
        )
        created = [parse_datetime(row['created_at']) for row in response.data['results']]
        self.assertEqual(created, sorted(created, reverse=True))
        self.assertIn('id', response.data['results'][0])
        self.assertEqual(
            response.data['results'][0]['created_at'][:10],
            '2020-01-12',
        )

    def test_explicit_created_at_desc_matches_the_default_sort(self):
        default_response = self.client.get(USER_LIST_URL)
        explicit = self.client.get(USER_LIST_URL, {'sort': 'created_at', 'direction': 'desc'})

        self.assertEqual(explicit.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [row['id'] for row in explicit.data['results']],
            [row['id'] for row in default_response.data['results']],
        )

    def test_created_at_asc_is_oldest_first(self):
        response = self.client.get(USER_LIST_URL, {'sort': 'created_at', 'direction': 'asc'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [row['first_name'] for row in response.data['results']],
            [f'Name {index:02d}' for index in range(12)],
        )

    def test_omitted_direction_defaults_to_descending(self):
        response = self.client.get(USER_LIST_URL, {'sort': 'email'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [row['email'] for row in response.data['results']],
            [f'user{index:02d}@example.com' for index in range(11, -1, -1)],
        )

    def test_sort_whitelist_orders_allowed_fields_and_rejects_the_rest(self):
        by_name = self.client.get(
            USER_LIST_URL, {'sort': 'first_name', 'direction': 'asc', 'page_size': 25}
        )
        self.assertEqual(by_name.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [row['first_name'] for row in by_name.data['results']],
            [f'Name {index:02d}' for index in range(12)],
        )

        by_email_desc = self.client.get(
            USER_LIST_URL, {'sort': ' email ', 'direction': ' DESC '}
        )
        self.assertEqual(by_email_desc.status_code, status.HTTP_200_OK)
        self.assertEqual(by_email_desc.data['results'][0]['email'], 'user11@example.com')
        self.assertEqual(by_email_desc.data['results'][-1]['email'], 'user00@example.com')

        by_staff = self.client.get(USER_LIST_URL, {'sort': 'is_staff', 'direction': 'asc'})
        self.assertEqual(by_staff.status_code, status.HTTP_200_OK)
        staff_flags = [row['isStaff'] for row in by_staff.data['results']]
        self.assertEqual(staff_flags, sorted(staff_flags))
        self.assertEqual(staff_flags[:6], [False] * 6)
        self.assertEqual(staff_flags[6:], [True] * 6)

        rejected = [
            'id',
            'username',
            'password',
            'date_joined',
            'is_superuser',
            'isStaff',
            'Email',
            '-created_at',
            'created_at;drop',
            'first_name,email',
        ]
        for sort in rejected:
            with self.subTest(sort=sort):
                response = self.client.get(USER_LIST_URL, {'sort': sort})
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn('sort', response.data['detail'])

    def test_invalid_sort_direction_is_rejected(self):
        for direction in ('ascending', 'descending', 'up', 'down', '1', 'desc;delete'):
            with self.subTest(direction=direction):
                response = self.client.get(
                    USER_LIST_URL, {'sort': 'email', 'direction': direction}
                )
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn('direction', response.data['detail'])

    def test_pagination_pages_compose_with_sort_order(self):
        first = self.client.get(
            USER_LIST_URL,
            {'page': 1, 'page_size': 10, 'sort': 'first_name', 'direction': 'asc'},
        )
        second = self.client.get(
            USER_LIST_URL,
            {'page': 2, 'page_size': 10, 'sort': 'first_name', 'direction': 'asc'},
        )

        self.assertEqual(first.status_code, status.HTTP_200_OK)
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(first.data['count'], 12)
        self.assertEqual(second.data['count'], 12)
        self.assertEqual(len(first.data['results']), 10)
        self.assertEqual(
            [row['first_name'] for row in first.data['results']],
            [f'Name {index:02d}' for index in range(10)],
        )
        self.assertEqual(
            [row['first_name'] for row in second.data['results']],
            ['Name 10', 'Name 11'],
        )
        first_ids = {row['id'] for row in first.data['results']}
        second_ids = {row['id'] for row in second.data['results']}
        self.assertTrue(first_ids.isdisjoint(second_ids))

    def test_default_sort_is_paginated_newest_first(self):
        first = self.client.get(USER_LIST_URL, {'page': '1', 'page_size': '10'})
        second = self.client.get(USER_LIST_URL, {'page': 2, 'page-size': 10})

        self.assertEqual(first.status_code, status.HTTP_200_OK)
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(second.data['page_size'], 10)
        self.assertEqual(
            [row['first_name'] for row in first.data['results']],
            [f'Name {index:02d}' for index in range(11, 1, -1)],
        )
        self.assertEqual(
            [row['first_name'] for row in second.data['results']],
            ['Name 01', 'Name 00'],
        )

    def test_allowed_page_sizes_and_page_size_precedence(self):
        for page_size in (10, 25, 50, 100):
            with self.subTest(page_size=page_size):
                response = self.client.get(USER_LIST_URL, {'page_size': page_size})
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(response.data['page_size'], page_size)
                self.assertEqual(len(response.data['results']), min(page_size, 12))
                self.assertEqual(response.data['count'], 12)

        both = self.client.get(USER_LIST_URL, {'page_size': 25, 'page-size': 10})
        self.assertEqual(both.status_code, status.HTTP_200_OK)
        self.assertEqual(both.data['page_size'], 25)

    def test_invalid_pagination_params_are_rejected(self):
        cases = [
            {'page': 0},
            {'page': -1},
            {'page': 'abc'},
            {'page': '1.5'},
            {'page': '1e1'},
            {'page_size': 0},
            {'page_size': -5},
            {'page_size': 9},
            {'page_size': 11},
            {'page_size': 101},
            {'page_size': 1000},
            {'page_size': 'foo'},
            {'page_size': '10.0'},
            {'page-size': 15},
            {'page-size': 0},
            {'page': '²'},
            {'page_size': '²'},
            {'page-size': '²'},
            {'page': '2²'},
            {'page': '1' * 5000},
            {'page_size': '1' * 5000},
        ]
        for params in cases:
            with self.subTest(params=params):
                response = self.client.get(USER_LIST_URL, params)
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn('detail', response.data)

    def test_blank_page_and_page_size_use_defaults(self):
        response = self.client.get(USER_LIST_URL, {'page': '  ', 'page_size': ''})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['page'], 1)
        self.assertEqual(response.data['page_size'], 25)
        self.assertEqual(response.data['results'][0]['first_name'], 'Name 11')

    def test_page_past_the_end_is_empty_and_keeps_the_total(self):
        response = self.client.get(USER_LIST_URL, {'page': 99, 'page_size': 10})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 12)
        self.assertEqual(response.data['page'], 99)
        self.assertEqual(response.data['page_size'], 10)
        self.assertEqual(response.data['results'], [])

    def test_blank_sort_and_direction_use_newest_first(self):
        response = self.client.get(USER_LIST_URL, {'sort': '   ', 'direction': ''})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['first_name'], 'Name 11')
        self.assertEqual(response.data['results'][-1]['first_name'], 'Name 00')


class UserListCaseInsensitiveSortTests(APITestCase):
    """Names and emails sort by letter, ignoring case.

    BINARY collation (SQLite, and Postgres with the C locale) orders ``Bob``
    before ``amy`` because ``B`` < ``a``. The list orders those as
    ``amy``, ``Bob``, ``carol`` on every engine, including Postgres.
    """

    @classmethod
    def setUpTestData(cls):
        specs = (
            ('amy', 'amy@example.com', False),
            ('Bob', 'Bob@example.com', True),
            ('carol', 'carol@example.com', False),
        )
        cls.users = []
        for index, (name, email, is_staff) in enumerate(specs):
            user = User.objects.create_user(
                username=name,
                email=email,
                password='password123',
                first_name=name,
                is_staff=is_staff,
            )
            User.objects.filter(pk=user.pk).update(
                date_joined=datetime(2021, 6, 1, tzinfo=datetime_timezone.utc) + timedelta(days=index)
            )
            user.refresh_from_db()
            cls.users.append(user)

    def setUp(self):
        self.client.force_authenticate(self.users[1])

    def test_name_and_email_sort_ignore_case(self):
        by_name = self.client.get(
            USER_LIST_URL,
            {'sort': 'first_name', 'direction': 'asc', 'page_size': 10},
        )
        by_email = self.client.get(
            USER_LIST_URL,
            {'sort': 'email', 'direction': 'asc', 'page_size': 10},
        )
        by_name_desc = self.client.get(
            USER_LIST_URL,
            {'sort': 'first_name', 'direction': 'desc', 'page_size': 10},
        )

        self.assertEqual(by_name.status_code, status.HTTP_200_OK, connection.vendor)
        self.assertEqual(
            [row['first_name'] for row in by_name.data['results']],
            ['amy', 'Bob', 'carol'],
            connection.vendor,
        )
        self.assertEqual(
            [row['email'] for row in by_email.data['results']],
            ['amy@example.com', 'Bob@example.com', 'carol@example.com'],
            connection.vendor,
        )
        self.assertEqual(
            [row['first_name'] for row in by_name_desc.data['results']],
            ['carol', 'Bob', 'amy'],
            connection.vendor,
        )
