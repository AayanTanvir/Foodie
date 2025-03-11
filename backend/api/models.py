from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.utils import timezone

from .managers import CustomUserManager
import uuid

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True, default="")
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    objects = CustomUserManager()
    
    def __str__(self):
        return self.username
    

class Restaurant(models.Model):
    name = models.CharField(max_length=255, unique=True) 
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="restaurants")
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="restaurants/", blank=True, null=True, default="restaurants/default.png")
    address = models.TextField(default="", unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True, default="")
    category = models.ManyToManyField('RestaurantCategory', blank=True, related_name='restaurants')
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_verified = models.BooleanField(default=False)
    is_maintained = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
    def is_open(self):
        now = timezone.localtime().time()
        return self.is_maintained and (self.opening_time <= now <= self.closing_time)
    
    def __str__(self):
        return self.name
    
    
class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="menu_items")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True, default="")
    category = models.ForeignKey('MenuItemCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='menu_items') 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="menu_items/", blank=True, null=True, default="menu_items/default.png")
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"
    
    
class MenuItemCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
    
    
class RestaurantCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
