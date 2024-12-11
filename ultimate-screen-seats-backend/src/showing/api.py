import traceback
from ninja_extra import Router

from cinema_room.models import CinemaRoom
from core.schemas import MessageSchema
from movie.models import Movie
from reservation.models import Reservation

from .schemas import ShowingSchema, ShowingCreateSchema, ShowingUpdateSchema
from .models import Showing

import helpers

router = Router()


@router.post('', response={201: ShowingSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_showing(request, payload: ShowingCreateSchema):
    """Create a new showing"""

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
        return 404, {"message": f"Movie with id {payload.movie_id} doesn't exist."}
    except CinemaRoom.DoesNotExist:
        return 404, {"message": f"Cinema room with id {payload.cinema_room_id} doesn't exist."}
    except Exception as e:
        traceback.print_exc()
        return 500, {"message": "An unexpected error ocurred during creating showing."}
    

@router.get('', response={200: list[ShowingSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_showings(request):
    """Fetch list of schowings"""

    try:
        showings = Showing.objects.all()

        return 200, showings
    except Showing.DoesNotExist:
        return 404, {"message": f"Showings doesn't exist."}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during fetching showings."}
    

@router.get('/{showing_id}', response={200: ShowingSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_showing(request, showing_id: int):
    """Fetch a single showing by `showing_id`"""
    try:
        showing = Showing.objects.get(id=showing_id)

        return 200, showing
    except Showing.DoesNotExist:
        return 404, {"message": f"Showing with id {showing_id} doesn't exist."}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during fetching showings."}
    

@router.get('/{showing_id}/available-seats', response={200: list, 404: MessageSchema}, auth=helpers.auth_required)
def get_available_seats(request, showing_id: int):
    """
    Get available seats for a specific showing
    """
    try:
        # Pobierz Showing
        showing = Showing.objects.select_related('cinema_room').get(id=showing_id)
        cinema_room = showing.cinema_room

        # Pobierz wszystkie rezerwacje dla tego seansu
        reserved_seats = Reservation.objects.filter(showing=showing).values_list('seat_row', 'seat_column')

        # Zablokuj zajęte miejsca
        seat_layout = [row[:] for row in cinema_room.seat_layout]  # Kopia układu
        for seat_row, seat_column in reserved_seats:
            seat_layout[seat_row][seat_column] = 0  # Oznacz jako zajęte (0)

        # Zwróć tylko miejsca dostępne
        available_seats = [
            {"row": row_index, "column": col_index}
            for row_index, row in enumerate(seat_layout)
            for col_index, seat in enumerate(row)
            if seat == 1  # Wolne miejsca
        ]

        return 200, available_seats
    except Showing.DoesNotExist:
        return 404, {"message": f"Showing with id {showing_id} doesn't exist."}


@router.patch('/{showing_id}', response={200: ShowingSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def update_showing(request, showing_id: int, payload: ShowingUpdateSchema):
    """Update an existing showing by `showing_id`."""

    try:
        showing = Showing.objects.get(id=showing_id)

        if payload.movie_id:
            try:
                movie = Movie.objects.get(id=payload.movie_id)
                showing.movie = movie
            except Movie.DoesNotExist:
                return 404, {"message": f"Movie with id {payload.movie_id} doesn't exist."}

        if payload.cinema_room_id:
            try:
                cinema_room = CinemaRoom.objects.get(id=payload.cinema_room_id)
                showing.cinema_room = cinema_room
            except CinemaRoom.DoesNotExist:
                return 404, {"message": f"Cinema room with id {payload.cinema_room_id} doesn't exist."}

        for attr, value in payload.dict(exclude_unset=True).items():
            if attr not in ("movie_id", "cinema_room_id"):
                setattr(showing, attr, value)

        showing.save()

        return 200, showing

    except Showing.DoesNotExist:
        return 404, {"message": f"Showing with id {showing_id} doesn't exist."}
    except Exception as e:
        return 500, {"message": "An unexpected error occurred during updating the showing."}


@router.delete('/{showing_id}', response={200: MessageSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def remove_showing(request, showing_id: int):
    """Remove a single showing by `showing_id`"""

    try:
        showing = Showing.objects.get(id=showing_id)

        showing.delete()

        return 200, {"message": f"Showing {showing_id} removed successfully."}
    except Showing.DoesNotExist:
        return 404, {"message": f"Showing with id {showing_id} doesn't exist."}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during fetching showings."}