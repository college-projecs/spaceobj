from django.urls import path
import views

urlpatterns = [
    # Example endpoints:
    path('?', views.get_planets, name='get_planets'),
    path('?', views.create_planet, name='create_planet'),
]