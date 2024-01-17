from datetime import timedelta

ACCESS_TOKEN_LIFETIME = timedelta(seconds=6)
REFRESH_TOKEN_LIFETIME = timedelta(days=1)
SIGNING_KEY = "S-XaAKGH70dyODsFJH18HphHG2zsa1gha4RG6OLbo2E"

DB_NAME = 'postgres'
DB_USER = 'postgres'
DB_PASSWORD = 'Maudeg12.34'
DB_HOST = 'localhost'
DB_PORT = '5432'

TIME_ZONE = 'UTC'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://0.0.0.0'
]

SECRET_KEY = 'django-insecure-h+4!%2!$f1v3dq$pk0e3pzyl3w5hw2x6oo!4lansq+d^mvmbkg'