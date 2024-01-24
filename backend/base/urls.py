from django.urls import path, include

app_name = 'base'
urlpatterns = [
    path('product/', include('base.Product.urls')),
]
