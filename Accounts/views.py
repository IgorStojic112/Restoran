from .forms import *
from django.contrib.auth import authenticate, login as auth_login , logout
from django.contrib.auth.password_validation import validate_password
from django.contrib import messages
from django.http import JsonResponse
from rest_framework.decorators import api_view , permission_classes
from rest_framework.response import Response
from .models import User
from serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.core.exceptions import ValidationError

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error' : 'Username, email and password are rquired'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error' : 'Username already exists'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error' : 'Email already exists'}, status=400)
    
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error' : list(e.messages)}, status=400)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'message' : 'Registration successful'})
    except Exception as e:
        return Response({'error': 'Registration failed, Please try again.'}, status=400)


@api_view(['GET'])
def user_info(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    if request.user.is_authenticated:
        return Response(serializer.data)
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=401)