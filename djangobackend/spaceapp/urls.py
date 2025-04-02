from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import planetsViewSet

router = DefaultRouter()
router.register('planets', planetsViewSet)

urlpatterns = [
    path ('api/', include (router.urls)),
]