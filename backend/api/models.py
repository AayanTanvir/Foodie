from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.utils import timezone

from .managers import CustomUserManager
import uuid
import pytz

class CustomUser(AbstractUser):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(max_length=150, unique=True, default="")
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    objects = CustomUserManager()
    
    def __str__(self):
        return str(self.username)
    

class Restaurant(models.Model):
    
    class RestaurantCategories(models.TextChoices):
        FINE_DINING = 'fine_dining', 'Fine Dining'
        VEGAN = 'vegan', 'Vegan'
        SEAFOOD = 'seafood', 'Seafood'
        FAST_FOOD = 'fast_food', 'Fast Food'
        DRINK_AND_BEVERAGES = 'drink_and_beverages', 'Drinks & Beverages'
        DESSERTS = 'desserts', 'Desserts'
        CAFE = 'cafe', 'Café'
        HALAL = 'halal', 'Halal'
        BBQ_AND_GRILLS = 'bbq_and_grills', 'BBQ & Grills'
        INDIAN = 'indian', 'Indian'
        CHINESE = 'chinese', 'Chinese'
        ITALIAN = 'italian', 'Italian'
        MEXICAN = 'mexican', 'Mexican'
        OTHER = 'other', 'Other'
        
        __empty__ = '----------'
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255, unique=True) 
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="restaurants")
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="restaurants/", blank=True, null=True, default="restaurants/default.jpg")
    address = models.TextField(default="", unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True, default="")
    category = models.CharField(max_length=25, choices=RestaurantCategories.choices, default=RestaurantCategories.OTHER)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_verified = models.BooleanField(default=False)
    is_maintained = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def is_open(self):
        if self.is_maintained:
            local_tz = pytz.timezone('Asia/Karachi')
            now = timezone.now().astimezone(local_tz).time()

            if self.opening_time < self.closing_time:
                return self.opening_time <= now < self.closing_time
            else:
                return now >= self.opening_time or now < self.closing_time
                         
        return False
    
    def __str__(self):
        return self.name
    
    
class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="menu_items")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True, default="") 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey("MenuItemCategory", related_name="menu_items", on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to="menu_items/", blank=True, null=True, default="menu_items/default.png")
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"
    
    
class MenuItemCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="menu_item_categories")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "restaurant"], name="unique_category_per_restaurant")
        ]
    
    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"
    

class Order(models.Model):
    
    class OrderStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
        
    
    class OrderPaymentMethod(models.TextChoices):
        CASH_ON_DELIVERY = 'cash_on_delivery', 'Cash On Delivery'
        CARD = 'card', 'Card'
        
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="orders")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="orders")
    order_items = models.ManyToManyField(MenuItem, through="OrderItem")
    order_status = models.CharField(max_length=25, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    payment_method = models.CharField(max_length=25, choices=OrderPaymentMethod.choices, default=OrderPaymentMethod.CASH_ON_DELIVERY)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def total_price(self):
        total_price = 0
        for order_item in self.order_items.all():
            total_price += order_item.sub_total
        return total_price
    
    def __str__(self):
        return f"{self.uuid} | {self.user.email} - {self.restaurant.name}"
    
    
class OrderItem(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    #discount = something
    
    
    @property
    def sub_total(self):
        #calculate discount here
        return self.menu_item.price * self.quantity
    
    def __str__(self):
        return f"{self.menu_item.name} - {self.order.uuid}"
