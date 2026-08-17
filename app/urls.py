
from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('api/menu/add/', views.add_meni_item, name='add_meni_item'),
    path('api/categories/', views.category_list, name='get_categories'),
    path('api/ingredient/', views.ingredient_list, name='get_ingredients'),
    path('api/ingredients/add', views.add_ingredients, name='add_ingredients'),
    path('api/menu/list', views.menu_list, name='menu_list'),
]