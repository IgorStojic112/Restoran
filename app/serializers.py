from rest_framework import serializers
from .models import MeniItem, Category, Ingredient, OrderItem, Order


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeniItem
        fields = "__all__"

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = "__all__"

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source="menu_item.Name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["menu_item", "menu_item_name", "quantity", "price"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "created_at",
            "total_price",
            "items",
        ]