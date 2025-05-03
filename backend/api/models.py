from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.utils import timezone
from django.core.exceptions import ValidationError

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
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def is_open(self):
        local_tz = pytz.timezone('Asia/Karachi')
        now = timezone.now().astimezone(local_tz).time()

        if self.opening_time < self.closing_time:
            return self.opening_time <= now < self.closing_time
        else:
            return now >= self.opening_time or now < self.closing_time

    
    @property
    def popularity(self):
        return self.orders.count()
    
    
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
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "restaurant"], name="unique_menu_item_per_restaurant")
        ]
    
    @property
    def popularity(self):
        return self.order_items.values("order").distinct().count()

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"
    
    
class MenuItemCategory(models.Model):
    name = models.CharField(max_length=255)
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
    discount = models.ForeignKey("Discount", blank=True, null=True, on_delete=models.SET_NULL, related_name="orders")
    
    @property
    def total_price(self):
        return sum(item.sub_total for item in self.orderitem_set.all())
    
    @property
    def discounted_price(self):
        total_price = self.total_price
        if self.discount:
            if self.discount.valid_from <= timezone.now() <= self.discount.valid_to:
                if total_price < self.discount.min_order_amount:
                    return total_price
                
                if self.discount.discount_type == Discount.DiscountType.PERCENTAGE:
                    total_price -= (total_price * self.discount.amount) / 100
                elif self.discount.discount_type == Discount.DiscountType.FIXED_AMOUNT:
                    total_price -= self.discount.amount
                elif self.discount.discount_type == Discount.DiscountType.FREE_DELIVERY:
                    return total_price
                    
                return total_price if total_price > 0 else 0
            
        return total_price
                
    
    def __str__(self):
        return f"{self.uuid} | {self.user.email} - {self.restaurant.name} - {self.total_price}"
    
    
class OrderItem(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="order_items")
    side_items = models.ManyToManyField("SideItem", through="OrderItemSideItem", related_name="order_items")
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    remark = models.CharField(max_length=255, blank=True, null=True, default="")
    quantity = models.IntegerField(default=1)
    
    
    @property
    def sub_total(self):
        return float((self.menu_item.price * self.quantity) + (self.side_items.aggregate(models.Sum('price'))['price__sum'] or 0))
    
    def __str__(self):
        return f"{self.menu_item.name} - {self.order.uuid}"
    
    
class MenuItemModifier(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="menu_item_modifiers", null=True, blank=True)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="modifiers")
    name = models.CharField(max_length=255)
    is_required = models.BooleanField(default=True)
    is_multiselect = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "menu_item"], name="unique_modifier_per_menu_item"),
        ]
    
    def clean(self):
        if self.restaurant and self.menu_item.restaurant != self.restaurant:
            raise ValidationError("MenuItem does not belong to the given Restaurant.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} | {self.menu_item}"


class MenuItemModifierChoice(models.Model):
    modifier = models.ForeignKey(MenuItemModifier, on_delete=models.CASCADE, related_name="choices")
    label = models.CharField(max_length=100)
    price = models.DecimalField(decimal_places=2, max_digits=5)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["label", "modifier"], name="unique_label_per_modifier")
        ]
    
    def __str__(self):
        return f"{self.label} for {self.modifier}"


class SideItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="side_items")
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='side_items/', blank=True, null=True, default="side_items/default.jpg")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.price}"


class OrderItemSideItem(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    side_item = models.ForeignKey(SideItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.side_item.name} for {self.order_item}"
    
    
class Discount(models.Model):
    
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'percentage', 'Percentage'
        FIXED_AMOUNT = 'fixed_amount', 'Fixed Amount'
        FREE_DELIVERY = 'free_delivery', 'Free Delivery'
       
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="discounts")
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    discount_type = models.CharField(max_length=25, choices=DiscountType.choices, default=DiscountType.PERCENTAGE)
    amount = models.IntegerField(default=0)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    @property
    def is_valid(self):
        local_tz = pytz.timezone('Asia/Karachi')
        now = timezone.now().astimezone(local_tz)
        
        return now >= self.valid_from and now <= self.valid_to
    
    def __str__(self):
        if self.discount_type == self.DiscountType.PERCENTAGE:
            return f"{self.amount}% off on minimum Rs.{self.min_order_amount} orders - {self.restaurant.name}"
        elif self.discount_type == self.DiscountType.FIXED_AMOUNT:
            return f"Rs. {self.amount} off on minimum Rs.{self.min_order_amount} orders - {self.restaurant.name}"
        elif self.discount_type == self.DiscountType.FREE_DELIVERY:
            return f"Free Delivery on minimum Rs.{self.min_order_amount} orders - {self.restaurant.name}"
        
        return f"{self.discount_type} - {self.restaurant.name}"

