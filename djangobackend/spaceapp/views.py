from django.shortcuts import render
from rest_framework import viewsets
from .models import planets
from .serializers import planetsSerializers

class planetsViewSet (viewsets.ModelViewSet):
    queryset = planets.objects.all()
    serializer_class = planetsSerializers