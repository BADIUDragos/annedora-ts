from django.urls import path
from base.User.views import UserListView, UserRetrieveDestroyView

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserRetrieveDestroyView.as_view(), name='user-detail-delete'),
]
