from django.contrib import admin
from .models import planets

@admin.register(planets)
class planetsAdmin(admin.ModelAdmin):
    list_display = ('name', 'diameter', 'mass', 'gravity', 'orbital_period', 'average_temperature', 'distance')