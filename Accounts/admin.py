from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# admin.site.register(User, UserAdmin)
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Preferences & Profile", {
            "fields": ("role", "profile_image", "dietary_preferences", "allergies")
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Role", {
            "fields": ("role",)
        }),
    )
    list_display = ["username", "email", "role", "is_staff", "is_active"]
    list_filter = ["role", "is_staff", "is_active"]
    search_fields = ["username", "email"]
    filter_horizontal = BaseUserAdmin.filter_horizontal + ("allergies",)