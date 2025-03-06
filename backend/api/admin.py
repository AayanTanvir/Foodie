from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("email", "is_email_verified", "is_staff", "is_active",)
    list_filter = ("email", "is_email_verified", "is_staff", "is_active",)
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
    search_fields = ("email", "username")
    ordering = ("email",)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(
    Restaurant,
    MenuItem,
    MenuItemCategory,
    RestaurantCategory,
    Discount,
    )
