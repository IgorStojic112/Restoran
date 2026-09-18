from django.contrib import admin
from .models import Category, Ingredient, MeniItem, Order, OrderItem
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .views import STATUS_MESSAGES


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
    list_display_links = ["id", "user"]
    list_editable = ["status"]
    list_filter = ["status"]
    search_fields = ["user__username"]
    inlines = [OrderItemInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change and "status" in form.changed_data:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"user_{obj.user.id}",
                {
                    "type": "order_status_update",
                    "order_id": obj.id,
                    "status": obj.status,
                    "message": STATUS_MESSAGES.get(obj.status, "Status narudžbe je ažuriran"),
                }
            )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "menu_item", "quantity", "price"]
