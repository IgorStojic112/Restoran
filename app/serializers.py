from rest_framework import serializers
from .models import MeniItem, Category, Ingredient


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
