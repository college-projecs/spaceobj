from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from spaceapp.views import planetsViewSet, CreatePlanetViewSet

router = DefaultRouter()
router.register('planets', planetsViewSet)
router.register('Create_planet', CreatePlanetViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path ('', include (router.urls)),
]
