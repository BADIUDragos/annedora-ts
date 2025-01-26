from django.urls import path
from base.User.views import UserListView, UserRetrieveDestroyView, UserUpdateView, forgot_password, \
    validate_token, update_password

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserRetrieveDestroyView.as_view(), name='user-detail-delete'),
    path('update/<int:pk>/', UserUpdateView.as_view(), name='user-update'),
    path('password_reset/', forgot_password, name='user-password-reset'),
    path('validate_token/', validate_token, name='user-validate-reset-token'),
    path('update_password/', update_password, name='user-change-password'),
]
