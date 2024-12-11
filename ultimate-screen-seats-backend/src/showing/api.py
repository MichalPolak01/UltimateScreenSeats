import traceback
from ninja_extra import Router

from cinema_room.models import CinemaRoom
from core.schemas import MessageSchema
from movie.models import Movie

from .schemas import ShowingSchema, ShowingCreateSchema
from .models import Showing

import helpers

router = Router()


@router.post('', response={201: ShowingSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_showing(request, payload: ShowingCreateSchema):

    try:
        movie = Movie.objects.get(id=payload.movie_id)
        cinema_room = CinemaRoom.objects.get(id=payload.cinema_room_id)

        showing = Showing.objects.create(
            movie=movie,
            cinema_room=cinema_room,
            date=payload.date,
            ticket_price=payload.ticket_price
        )

        return 201, showing
    except Movie.DoesNotExist:
        return 404, {"message": {f"Movie with id {payload.movie_id} doesn't exist."}}
    except CinemaRoom.DoesNotExist:
        return 404, {"message": {f"Cinema room with id {payload.cinema_room_id} doesn't exist."}}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error ocurred during creating showing."}
    

@router.get('', response={200: list[ShowingSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_showings(request):
    try:
        showings = Showing.objects.all()

        return 200, showings
    except Showing.DoesNotExist:
        return 404, {"message": {f"Showings doesn't exist."}}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during fetching showings."}