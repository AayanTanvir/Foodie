from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.utils import timezone

from .managers import CustomUserManager


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
    
    CATEGORY_CHOICES = [
        ("fast-food", "Fast Food"),
        ("chinese", "Chinese"),
        ("indian", "Indian"),
        ("italian", "Italian"),
        ("cakes-and-bakery", "Cakes & Bakery"),
        ("deserts", "Deserts"),
        ("healthy", "Healthy"),
        ("savouries", "Savouries"),
        ("others", "Others"),
    ]
    
    name = models.CharField(max_length=255, unique=True) 
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="restaurants")
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="restaurants/", blank=True, null=True, default="restaurants/default.png")
    address = models.TextField(default="", unique=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    phone = models.CharField(max_length=15, unique=True, blank=True, default="")
    category = models.ManyToManyField('RestaurantCategory', blank=True, related_name='restaurants')
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_open = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    discounts = models.ManyToManyField('Discount', blank=True, related_name='restaurants')
        
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
    def is_fully_open(self):
        now = timezone.localtime().time()
        return self.is_open and (self.opening_time <= now <= self.closing_time)
    
    
    def __str__(self):
        return self.name
    
    
class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="menu_items")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="menu_items/", blank=True, null=True, default="menu_items/default.png")
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey('MenuItemCategory', on_delete=models.SET_NULL, blank=True, related_name='menu_items')
    
    discounts = models.ManyToManyField('Discount', blank=True, related_name='menu_items')
    
    def get_discounted_price(self, total_order_price=0):
        
        now = timezone.now()
        discount = self.discounts.filter(
            menu_item=self,
            start_date__lte=now,
            end_date__gte=now,
            min_order_amount__lte=total_order_price
            ).first()
        
        if not discount:
            discount = self.discounts.filter(
                category=self.category,
                start_date__lte=now,
                end_date__gte=now,
                min_order_amount__lte=total_order_price
                ).first()
            
        if not discount:
            discount = self.discounts.filter(
                is_global=True,
                start_date__lte=now,
                end_date__gte=now,
                min_order_amount__lte=total_order_price
                ).first()
            
        if not discount:
            return self.price
        
        if discount.discount_type == "percentage":
            return self.price * (1 - discount.value / 100)
        elif discount.discount_type == "fixed":
            return max(self.price - discount.value, 0)

        return self.price

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
    
    
class Discount(models.Model):
    
    DISCOUNT_TYPE_CHOICES = [
        ("percentage", "Percentage"),
        ("fixed", "Fixed"),
    ]
    
    name = models.CharField(max_length=255)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, blank=True, null=True, related_name='discounts')
    menu_item = models.ForeignKey('MenuItem', on_delete=models.CASCADE, blank=True, null=True, related_name='discounts')
    is_global = models.BooleanField(default=False)
    
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} - ({self.discount_type} - {self.value})"
    
    def is_active(self):
        now = timezone.localtime()
        return self.start_date <= now and (self.end_date is None or now <= self.end_date)
