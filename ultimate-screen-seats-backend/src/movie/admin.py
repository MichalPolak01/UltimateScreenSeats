from django.contrib import admin

from .models import Movie


class MovieAdmin(admin.ModelAdmin):
    model = Movie
    list_display = ("id", "title", "genre", "movie_length", "age_classification", "image", "release_date")
    search_fields = ("id", "title", "description", "genre", "movie_length", "age_classification", "image", "release_date")


admin.site.register(Movie, MovieAdmin)