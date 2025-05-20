from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import planetsViewSet, CreatePlanetViewSet

router = DefaultRouter()
router.register('planets', planetsViewSet)
router.register('Create_planet', CreatePlanetViewSet)

urlpatterns = [
    path ('', include (router.urls)),
]