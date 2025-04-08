from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("uuid", "email", "is_staff", "is_active",)
    list_filter = ("email", "uuid", "is_email_verified", "is_staff", "is_active",)
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
admin.site.register(MenuItem)
admin.site.register(MenuItemCategory)
admin.site.register(SideItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(MenuItemModifier)
admin.site.register(MenuItemModifierChoice)
admin.site.register(Discount)

