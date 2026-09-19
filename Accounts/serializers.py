from rest_framework import serializers

from app.models import Ingredient
from .models import User

class UserSerializer(serializers.ModelSerializer):
    
    profileImage = serializers.ImageField(source='profile_image', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profileImage']

    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class IngredientMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["id", "Name"]


class UserProfileSerializer(serializers.ModelSerializer):
    # On read: returns full ingredient objects
    allergies = IngredientMinimalSerializer(many=True, read_only=True)
    # On write: accepts a list of ingredient IDs
    allergy_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Ingredient.objects.filter(is_allergen=True),
        source="allergies",
        write_only=True,
        required=False,
    )

    class Meta:
        model = User
        fields = [
            "id", "username", "email",
            "dietary_preferences",
            "allergies", "allergy_ids",
            "profile_image",
        ]
        read_only_fields = ["id", "username", "email"]