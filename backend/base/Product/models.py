from django.db import models
from django.contrib.auth.models import User

CATEGORY_CHOICES = [
    ('honey', 'Honey'),
    ('candles', 'Candles'),
    ('soaps', 'Soaps'),
    ('other', 'Other'),
]


class Product(models.Model):

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to='images', default='/placeholder.png')
    category = models.CharField(max_length=200, null=True, blank=True, choices=CATEGORY_CHOICES, default='other')
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    num_reviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    count_in_stock = models.IntegerField(null=True, blank=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
