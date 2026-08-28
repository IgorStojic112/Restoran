
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    #path('logout/', views.logout_view, name='logout'),
    path('userinfo/', views.user_info, name='user_info'),
    path('changepassword/', views.change_password, name='change_password'),
]
