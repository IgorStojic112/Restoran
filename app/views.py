from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render
from .serializers import MenuItemSerializer, CategorySerializer, IngredientSerializer
from .models import MeniItem, Category, Ingredient


def home(request):
    return render(request, 'home.html') #, {'form': form} 

@api_view(['GET'])
def menu_list(request):
    dishes = MeniItem.objects.all()

    serializer = MenuItemSerializer(dishes, many=True)

    return Response({
        "dishes": serializer.data
    })
    

@api_view(['GET'])
def category_list(request):
    
    categories = Category.objects.all()
    serializer = CategorySerializer(
        categories,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
def ingredient_list(request):

    ingredients = Ingredient.objects.all() 
    serializer = IngredientSerializer(
        ingredients,
        many=True
    )

    return Response(serializer.data)

@api_view(['POST'])
def add_meni_item(request):
    
    data = request.data
    data._mutable = True

    category_name = data.get("Category")
    ingredient_ids = data.getlist("Ingredient")

    if not category_name:
        return Response(
            {"error": "Category name is required"},
            status=400
        )
    
    if not ingredient_ids:
        return Response(
            {"error": "Ingredients are required"},
            status=400
        )

    category, created = Category.objects.get_or_create(
        Name=category_name,
        defaults={"Description": ""}
    )

    data["Category"] = category.id
    data.setlist("Ingredient", ingredient_ids)

    data._mutable = False

    serializer = MenuItemSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
def add_ingredients(request):

    serializer = IngredientSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=201)
    
    return Response(serializer.errors,status=400)


