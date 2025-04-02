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
