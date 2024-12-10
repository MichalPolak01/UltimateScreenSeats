import traceback
from ninja_extra import Router

from core.schemas import MessageSchema
from .schemas import MovieSchema, MovieCreateSchema, MovieUpdateSchema
from .models import Movie

import helpers

router = Router()

@router.post('', response={201: MovieSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_movie(request, payload: MovieCreateSchema):
    """Create a new movie"""

    try:
        movie = Movie.objects.create(**payload.dict())

        return 201, movie
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during create movie."}
    

@router.get('', response={200: list[MovieSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_movies(request):
    """Fetch list of movies"""

    try:
        movies = Movie.objects.all().order_by('-release_date')

        return 200, movies
    except Movie.DoesNotExist:
        return 404, {"message", {"Movies not found."}}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during fetching movies."}
    

@router.get('{movie_id}', response={200: list[MovieSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_movie(request, movie_id: int):
    """Fetch a single movie by `movie_id`"""

    try:
        movie = Movie.objects.filter(id=movie_id)

        return 200, movie
    except Movie.DoesNotExist:
        return 404, {"message", {f"Movie with id {movie_id} not found."}}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during fetching movie with id {movie_id}."}
    

@router.patch('{movie_id}', response={200: MovieSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def update_movie(request, payload: MovieUpdateSchema, movie_id: int):
    """Update an existing movie by `movie_id`"""

    try:
        movie = Movie.objects.get(id=movie_id)

        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(movie, attr, value)

        movie.save()

        return 200, movie
    except Movie.DoesNotExist:
        return 404, {"message", {f"Movie with id {movie_id} not found."}}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during updating movie with id {movie_id}."}
    

@router.delete('{movie_id}', response={200: MessageSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def delete_movie(response, movie_id: int):
    "Remove a movie by `movie_id`"
    
    try:
        movie = Movie.objects.get(id=movie_id)

        movie.delete()

        return 200, {"message": "Movie {movie_id} removed successfully."}
    except Movie.DoesNotExist:
        return 404, {"message", {f"Movie with id {movie_id} not found."}}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during removeing movie with id {movie_id}."}