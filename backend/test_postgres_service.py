from django.db import connection
from django.test import TestCase


class PostgresServiceTests(TestCase):
    def test_ci_database_is_postgresql(self):
        self.assertEqual(connection.vendor, "postgresql")
