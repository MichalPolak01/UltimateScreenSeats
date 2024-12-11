from ninja_extra import Router

from core.schemas import MessageSchema

from .schemas import ReservationCreateSchema, ReservationSchema
from showing.models import Showing
from .models import Reservation

import helpers

router = Router()


@router.post('', response={201: ReservationSchema, 400: MessageSchema, 404: MessageSchema}, auth=helpers.auth_required)
def create_reservation(request, payload: ReservationCreateSchema):
    """Create a reservation for a specific seat"""

    try:
        user = request.user

        showing = Showing.objects.get(id=payload.showing_id)
        cinema_room = showing.cinema_room

        if payload.seat_row >= len(cinema_room.seat_layout) or payload.seat_column >= len(cinema_room.seat_layout[0]):
            return 400, {"message": "Invalid seat coordinates."}

        if Reservation.objects.filter(showing=showing, seat_row=payload.seat_row, seat_column=payload.seat_column).exists():
            return 400, {"message": "Seat is already reserved."}

        reservation = Reservation.objects.create(
            showing=showing,
            user=user,
            seat_row=payload.seat_row,
            seat_column=payload.seat_column
        )

        return 201, reservation
    except Showing.DoesNotExist:
        return 404, {"message": f"Showing with id {payload.showing_id} doesn't exist."}
    except Exception as e:
        return 400, {"message": f"An unexpected error occurred: {e}"}
    

@router.get('', response={200: list[ReservationSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_reservations(request):
    """Fetch list of reservations"""
    try:
        reservations = Reservation.objects.all()

        return 200, reservations
    except Reservation.DoesNotExist:
        return 404, {"message": "Reservations doen't exist."}
    except Exception as e:
        return 400, {"message": f"An unexpected error occurred: {e}"}
    

@router.get('/{option}/{id}', response={200: list[ReservationSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_reservations_with_option(request, option: str, id: int):
    """Fetch reservations by single `user` or `movie`"""

    try:
        if option == "user":
            reservations = Reservation.objects.filter(user_id=id)
        elif option == "movie":
            reservations = Reservation.objects.filter(showing__movie_id=id)
        else:
            return 404, {"message": f"Invalid option '{option}'. Use 'user' or 'movie'."}

        if not reservations.exists():
            return 404, {"message": f"No reservations found for {option} with id {id}."}

        return 200, list(reservations)

    except Exception as e:
        return 500, {"message": f"An unexpected error occurred: {e}"}
    

@router.get('{reservation_id}', response={200: ReservationSchema, 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_reservation(request, reservation_id: int):
    """Fetch single reservation by `reservation_id`"""

    try:
        reservation = Reservation.objects.get(id=reservation_id)

        return 200, reservation
    except Reservation.DoesNotExist:
        return 404, {"message": "Reservations doen't exist."}
    except Exception as e:
        return 400, {"message": f"An unexpected error occurred: {e}"}