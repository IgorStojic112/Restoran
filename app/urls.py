
from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('api/menu/add/', views.add_meni_item, name='add_meni_item'),
    path('api/categories/', views.category_list, name='get_categories'),
    path('api/ingredient/', views.ingredient_list, name='get_ingredients'),
    path('api/ingredients/add', views.add_ingredients, name='add_ingredients'),
    path('api/menu/list', views.menu_list, name='menu_list'),
    path('api/orders/create', views.create_order, name='create_order'),
    path('api/menu/<int:item_id>/delete/', views.delete_menu_item, name='delete_menu_item'),
    path('api/orders/list/', views.order_list, name='order_list'),
    path('api/orders/<int:order_id>/status/', views.update_order_status, name='update_order_status'),

    path("api/menu/<int:dish_id>/qa/", views.dish_qa, name="dish_qa"),
    path("api/menu/recommend/", views.recommend_dishes, name="recommend_dishes"),
]