from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    genre = models.CharField(max_length=64)
    movie_length = models.IntegerField(default=0.0)
    age_classification = models.IntegerField(default=0)
    image = models.CharField(max_length=255)

    def __str__(self):
        return {
            'title': self.title,
            'description': self.description,
            'genere': self.genre,
            'movie_length': self.movie_length,
            'age_classification': self.age_classification,
            'image': self.image
        }