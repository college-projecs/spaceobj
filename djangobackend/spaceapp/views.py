from django.shortcuts import render
from rest_framework import viewsets
from .models import planets, CreatePlanet
from .serializers import planetsSerializers, CreatePlanetSerializers

class planetsViewSet (viewsets.ModelViewSet):
    queryset = planets.objects.all()
    serializer_class = planetsSerializers

class CreatePlanetViewSet (viewsets.ModelViewSet):
    queryset = CreatePlanet.objects.all()
    serializer_class = CreatePlanetSerializers