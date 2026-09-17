from django.contrib import admin
from .models import Category, Ingredient, MeniItem, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "Name", "Description"]
    search_fields = ["Name"]


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ["id", "Name", "is_allergen", "is_vegetarian", "is_vegan"]
    list_filter = ["is_allergen", "is_vegetarian", "is_vegan"]
    search_fields = ["Name"]


@admin.register(MeniItem)
class MeniItemAdmin(admin.ModelAdmin):
    list_display = ["id", "Name", "Category", "Price", "Available"]
    list_filter = ["Category", "Available"]
    search_fields = ["Name"]
    filter_horizontal = ["Ingredient"]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["menu_item", "quantity", "price"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "status", "total_price", "created_at"]
    list_filter = ["status"]
    search_fields = ["user__username"]
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "menu_item", "quantity", "price"]
