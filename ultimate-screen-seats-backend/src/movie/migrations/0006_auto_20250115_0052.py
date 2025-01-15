# Generated by Django 5.1.4 on 2025-01-14 23:52

from django.db import migrations

def add_default_genres(apps, schema_editor):
    Genre = apps.get_model('movie', 'Genre')
    genres = [
        "Akcja",
        "Animowane",
        "Przygodowe",
        "Horrory",
        "Dokumentacyjne",
        "Romanse",
        "Dla dzieci",
        "Komedie",
    ]
    for genre_name in genres:
        Genre.objects.create(name=genre_name)


class Migration(migrations.Migration):
    dependencies = [
        ("movie", "0005_genre_remove_movie_genre_movie_genre"),
    ]

    operations = []
