from django.urls import path, include

app_name = 'base'
urlpatterns = [
    path('product/', include('base.Product.urls')),
    path('users/', include('base.User.urls')),
    path('contact/', include('base.ContactForm.urls')),
]
