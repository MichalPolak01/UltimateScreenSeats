from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    genre = models.CharField(max_length=64)
    movie_length = models.IntegerField(default=0.0)
    age_classification = models.IntegerField(default=0)
    image = models.CharField(max_length=255)
    release_date = models.DateField(blank=True, null=True)