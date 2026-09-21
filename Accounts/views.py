from .forms import *
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.password_validation import validate_password
from django.contrib import messages
from django.http import JsonResponse
from rest_framework.decorators import api_view , permission_classes , parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.core.exceptions import ValidationError
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from .serializers import UserSerializer, LoginSerializer, UserProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error' : 'Korisnicko ime, email i lozinka su potrebni'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error' : 'Korisnicko ime vec postoji'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error' : 'Email vec postoji'}, status=400)
    
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
@permission_classes([IsAuthenticated])
def user_info(request):
    serializer = UserSerializer(request.user, context={"request" : request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_image(request):
    file = request.FILES.get("profile_image")
    if not file:
        return Response({"error" : "No image provided"}, status=400)
    
    request.user.profile_image = file
    request.user.save()

    serializer = UserSerializer(request.user, context={"request": request})
    return Response(serializer.data)
                         

    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({'error' : 'Pogresno ime ili lozinka'}, status=401)
    
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token' : token.key, 'message' : 'Dobrodosli'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message' : 'Loged out'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    
    user = request.user

    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response({'error' : 'Potrebno je unjeti strau i novu lozinku'}, status=400)
    
    if not user.check_password(old_password):
        return Response({'error' : 'Stara lozinka nije ispravan'}, status=400)

    if old_password == new_password:
        return Response({'error': 'Nova loznika ne moze biti ista kao i stara'}, status=400)

    try:
        validate_password(new_password)
    except ValidationError as e:
        return Response({'error' : list(e.messages)}, status=400)
    

    user.set_password(new_password)
    user.save()

    update_session_auth_hash(request, user)
    
    
    return Response({'message' : 'Uspjesno ste promjenili lozinku'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_email(request):

    user = request.user
    password = request.data.get('password')
    new_email = request.data.get('new_email')

    if not password or not new_email:
        return Response({'error' : 'Potrebno je unjeti lozinku i novi email'}, status=400)
    
    if not user.check_password(password):
        return Response({'error': 'Ne ispravna lozinka'})
    
    new_email = new_email.strip().lower()

    if new_email == user.email.lower():
        return Response({'error': 'Novi email ne moze biti isti kao i stari'},status=400)
    
    try:
        validate_email(new_email)
    except ValidationError:
        return Response({'error': 'Ne ispravan email (format)'},status=400)

    User = get_user_model()
    if User.objects.filter(email__iexact=new_email).exclude(pk=user.pk).exists():
        return Response({'error' : 'Email adresa vec je zauzeta'}, status=400)
    
    user.email = new_email
    user.save()

    update_session_auth_hash(request,user)

    return Response({'message': 'Uspjesno promjenjena email adressa'})

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