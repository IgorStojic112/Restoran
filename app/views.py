from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render

from Accounts.serializers import UserProfileSerializer
from .serializers import MenuItemSerializer, CategorySerializer, IngredientSerializer
from .models import MeniItem, Category, Ingredient, Order, OrderItem
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from decimal import Decimal

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from google import genai
from google.genai import types
from django.conf import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)


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
@permission_classes([IsAuthenticated])
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):

    items = request.data.get("items")

    if not items:
        return Response( {"error": "Naruzba je prazna"}, status=status.HTTP_400_BAD_REQUEST)

    total_price = Decimal("0.00")
    order = Order.objects.create(
        user=request.user,
        total_price=Decimal(0.00)
    )

    for item in items:
        menu_item_id = item.get("menu_item")
        quantity = item.get("quantity")

        try:
            menu_item = MeniItem.objects.get(id=menu_item_id)
        except MeniItem.DoesNotExist:
            order.delete()
            return Response({"error": f"Stvar sa mnenia {menu_item_id} ne postoji"}, status=status.HTTP_400_BAD_REQUEST)
        
        item_price = menu_item.Price

        OrderItem.objects.create(
            order=order,
            menu_item=menu_item,
            quantity=quantity,
            price=item_price,
        )

        total_price += item_price * quantity
    
    order.total_price = total_price
    order.save()

    return Response({
        "message": "Narudzba uspjesno predana",
        "order_id": order.id,
        "total_price": order.total_price 
    },
    status=status.HTTP_201_CREATED
    )

STATUS_MESSAGES = {
    "PENDING":        "Vaša narudžba je primljena",
    "PREPARING": "Vaša narudžba se priprema",
    "READY":          "Vaša narudžba je gotova",
    "COMPLETED":      "Narudžba je predana, dobar tek!",
    "CANCELLED":      "Vaša narudžba je otkazana",
}

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.select_related("user").get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    new_status = request.data.get("status")
    if new_status not in STATUS_MESSAGES:
        return Response(
            {"error": f"Invalid status. Choose from: {list(STATUS_MESSAGES.keys())}"},
            status=400
        )

    order.status = new_status
    order.save()

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{order.user.id}",
        {
            "type": "order_status_update",
            "order_id": order.id,
            "status": order.status,
            "message": STATUS_MESSAGES[new_status],
        }
    )

    return Response({"order_id": order.id, "status": order.status})

@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    if request.method == "GET":
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    serializer = UserProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def dish_qa(request, dish_id):
    try:
        dish = MeniItem.objects.prefetch_related("Ingredient").get(id=dish_id)
    except MeniItem.DoesNotExist:
        return Response({"error": "Dish not found"}, status=404)

    question = request.data.get("question", "").strip()
    if not question:
        return Response({"error": "Question is required"}, status=400)

    ingredients = ", ".join(
        i.Name for i in dish.Ingredient.all()
    ) or "nisu navedeni"

    prompt = f"""Ti si asistent u restoranu. Odgovaraj samo na pitanja vezana uz jelo.

                Jelo: {dish.Name}
                Opis: {dish.Description}
                Sastojci: {ingredients}

                Korisnikovo pitanje: {question}

                Odgovori kratko i jasno na hrvatskom jeziku. Ako pitanje nije vezano uz ovo jelo ili restoran, ljubazno odbij odgovoriti."""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
        ),
)
        return Response({"answer": response.text})
    except Exception as e:
        print(f"Gemini error: {e}")
        return Response({"error": "AI servis trenutno nije dostupan"}, status=503)


@api_view(["POST"])
def recommend_dishes(request):
    message = request.data.get("message", "").strip()
    if not message:
        return Response({"error": "Poruka je obavezna"}, status=400)

    dishes = MeniItem.objects.filter(Available=True).prefetch_related("Ingredient")
    if not dishes.exists():
        return Response({"recommendations": []})

    dish_map = {d.id: d for d in dishes}

    menu_lines = []
    for dish in dishes:
        ingredients = ", ".join(i.Name for i in dish.Ingredient.all()) or "nisu navedeni"
        menu_lines.append(
            f"ID: {dish.id} | Naziv: {dish.Name} | Opis: {dish.Description} "
            f"| Sastojci: {ingredients} | Cijena: {dish.Price}€"
        )
    menu_text = "\n".join(menu_lines)

    prompt = f"""Ti si asistent za preporuku jela u restoranu. Ispod je popis dostupnih jela.

            {menu_text}

            Korisnikov upit: "{message}"

            Odaberi do 3 jela s popisa koja najbolje odgovaraju korisnikovom upitu. Koristi isključivo ID-eve jela s popisa iznad. Za svako odabrano jelo napiši kratko objašnjenje (jedna rečenica) zašto odgovara upitu, na hrvatskom jeziku."""

    response_schema = types.Schema(
        type=types.Type.OBJECT,
        properties={
            "recommendations": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "id": types.Schema(type=types.Type.INTEGER),
                        "reason": types.Schema(type=types.Type.STRING),
                    },
                    required=["id", "reason"],
                ),
            )
        },
        required=["recommendations"],
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            ),
        )
        result = json.loads(response.text)
    except Exception as e:
        print(f"Gemini error: {e}")
        return Response({"error": "AI servis trenutno nije dostupan"}, status=503)

    recommendations = []
    for rec in result.get("recommendations", []):
        dish = dish_map.get(rec.get("id"))
        if not dish:
            continue
        data = MenuItemSerializer(dish).data
        data["reason"] = rec.get("reason", "")
        recommendations.append(data)

    return Response({"recommendations": recommendations})