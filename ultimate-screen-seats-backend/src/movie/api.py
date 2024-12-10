from ninja_extra import Router

from core.schemas import MessageSchema
from .schemas import MovieSchema, MovieCreateSchema
from .models import Movie

import helpers

router = Router()

@router.post('', response={201: MovieSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_movie(request, payload: MovieCreateSchema):
    try:
        movie = Movie.objects.create(**payload.dict())

        return 201, movie
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during create movie."}