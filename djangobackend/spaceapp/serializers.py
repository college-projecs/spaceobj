from rest_framework import serializers, viewsets
from .models import planets

class planetsSerializers(serializers.ModelSerializer):
    class Meta:
        model = planets
        fields = '__all__'