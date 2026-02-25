from django.shortcuts import render, redirect
from .forms import *
from django.contrib.auth import authenticate, login as auth_login , logout
from django.contrib import messages
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from serializers import *
from rest_framework.authtoken.models import Token 

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error' : 'Username and password are required'}, status=400)
    
    user = authenticate(request, username=username, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key ,'message': 'Login successful'})
    else:
        return Response({'error' : 'Invalid username or password'}, status=401)
    

@api_view(['GET'])
def user_info(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    if request.user.is_authenticated:
        return Response(serializer.data)
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=401)
    

"""""

def login (request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth_login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})


def register_view (request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            redirect('login')
    else:
        form = RegistrationForm()
        
    return render(request, 'register.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

"""