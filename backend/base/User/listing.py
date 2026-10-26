"""Query-parameter parsing for the admin user list.

Pagination and sorting are applied in the database. Sort fields are a fixed
whitelist so request values cannot be interpolated into ``order_by``.

Names and emails are ordered with ``Lower()`` so the result does not depend on
the database collation. SQLite's BINARY collation sorts uppercase before
lowercase; Postgres uses the cluster locale. Case-insensitive ordering makes
those two engines agree.
"""

from dataclasses import dataclass

from django.db.models.functions import Lower

ALLOWED_PAGE_SIZES = (10, 25, 50, 100)
DEFAULT_PAGE_SIZE = 25

# Public sort keys mapped to real User columns. ``created_at`` is Django's
# ``date_joined`` (set when the row is inserted).
SORT_FIELDS = {
    'first_name': 'first_name',
    'email': 'email',
    'is_staff': 'is_staff',
    'created_at': 'date_joined',
}

DEFAULT_SORT = 'created_at'
DEFAULT_DIRECTION = 'desc'
ALLOWED_DIRECTIONS = ('asc', 'desc')
CASE_INSENSITIVE_FIELDS = frozenset({'first_name', 'email'})


@dataclass(frozen=True)
class UserListParams:
    page: int
    page_size: int
    sort: str
    direction: str

    def ordering(self):
        """ORM ``order_by`` args. Primary key breaks ties in the same direction."""
        field = SORT_FIELDS[self.sort]
        descending = self.direction == 'desc'
        pk = '-pk' if descending else 'pk'
        if field in CASE_INSENSITIVE_FIELDS:
            expression = Lower(field)
            if descending:
                expression = expression.desc()
            return (expression, pk)
        prefix = '-' if descending else ''
        return (f'{prefix}{field}', pk)


def parse_user_list_params(query_params):
    """Return ``(UserListParams, None)`` or ``(None, error_message)``."""
    page, page_error = _parse_page(query_params.get('page'))
    if page_error:
        return None, page_error

    page_size, size_error = _parse_page_size(query_params)
    if size_error:
        return None, size_error

    sort, sort_error = _parse_sort(query_params.get('sort'))
    if sort_error:
        return None, sort_error

    direction, direction_error = _parse_direction(query_params.get('direction'))
    if direction_error:
        return None, direction_error

    return UserListParams(
        page=page,
        page_size=page_size,
        sort=sort,
        direction=direction,
    ), None


def _parse_page(raw):
    if raw is None or str(raw).strip() == '':
        return 1, None
    page = _positive_int(raw)
    if page is None:
        return None, 'page must be a positive integer.'
    return page, None


def _parse_page_size(query_params):
    raw = query_params.get('page_size')
    if raw is None:
        raw = query_params.get('page-size')
    if raw is None or str(raw).strip() == '':
        return DEFAULT_PAGE_SIZE, None
    page_size = _positive_int(raw)
    if page_size not in ALLOWED_PAGE_SIZES:
        allowed = ', '.join(str(size) for size in ALLOWED_PAGE_SIZES)
        return None, f'page_size must be one of {allowed}.'
    return page_size, None


def _parse_sort(raw):
    if raw is None or str(raw).strip() == '':
        return DEFAULT_SORT, None
    sort = str(raw).strip()
    if sort not in SORT_FIELDS:
        allowed = ', '.join(sorted(SORT_FIELDS))
        return None, f'sort must be one of {allowed}.'
    return sort, None


def _parse_direction(raw):
    if raw is None or str(raw).strip() == '':
        return DEFAULT_DIRECTION, None
    direction = str(raw).strip().lower()
    if direction not in ALLOWED_DIRECTIONS:
        return None, 'direction must be asc or desc.'
    return direction, None


def _positive_int(value):
    text = str(value).strip()
    # ``isdigit`` is true for characters such as ``²``, and ``int('²')`` raises.
    # ``isdecimal`` is only the digits ``int`` accepts, so ``int`` cannot fail.
    if not text.isdecimal():
        return None
    number = int(text)
    if number < 1:
        return None
    return number
