from rest_framework.permissions import BasePermission


class IsSelfOrAdmin(BasePermission):
    """
    Allows access only to the user themselves or to admin users.
    """
    def has_permission(self, request, view):
        user_id = view.kwargs.get('id')
        return bool(request.user and (request.user.is_staff or request.user.id == int(user_id)))

