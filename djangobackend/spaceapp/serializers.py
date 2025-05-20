from rest_framework import serializers, viewsets
from .models import planets, CreatePlanet

class planetsSerializers(serializers.ModelSerializer):
    class Meta:
        model = planets
        fields = '__all__'

class CreatePlanetSerializers(serializers.ModelSerializer):
    class Meta:
        model = CreatePlanet
        fields = '__all__'