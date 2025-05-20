from django.db import models

class planets(models.Model):
    name = models.CharField(max_length=100)
    diameter = models.FloatField()
    mass = models.FloatField()
    gravity = models.FloatField()
    orbital_period = models.FloatField()
    average_temperature = models.FloatField()
    distance = models.FloatField()

    def __str__(self):
        return self.name

class CreatePlanet(models.Model):
    name = models.CharField(max_length=100)
    seed = models.FloatField()
    planet_size = models.FloatField()
    orbit_radius = models.FloatField()
    axial_tilt = models.FloatField()
    orbit_speed = models.FloatField()
    water_threshold = models.FloatField()
    show_rings = models.FloatField()
    color_mode = models.CharField(max_length=100)
    gas_type = models.CharField(max_length=100)

    def __str__(self):
        return self.name
