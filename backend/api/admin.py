from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("uuid", "email", "is_email_verified", "is_staff", "is_active",)
    list_filter = ("is_email_verified", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "username", "password", "is_email_verified",)}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "username", "password1", "password2", "is_email_verified", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("username", "uuid", "email")
    ordering = ("email",)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Restaurant)


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'name', 'price', 'restaurant')
    list_filter = ('is_side_item', 'is_available', 'restaurant')


admin.site.register(MenuItemCategory)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'order_status', 'payment_method', 'user', 'restaurant')
    list_filter = ('order_status', 'payment_method')


admin.site.register(OrderItem)
admin.site.register(MenuItemModifier)
admin.site.register(MenuItemModifierChoice)

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'restaurant', 'is_valid', 'discount_type', 'amount', 'min_order_amount')
    list_filter = ('restaurant', 'discount_type')
    
    def is_valid(self, obj):
        return obj.is_valid