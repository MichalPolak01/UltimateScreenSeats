from ninja_extra import Router

from .schemas import CinemaRoomSchema, CinemaRoomCreateSchema
from core.schemas import MessageSchema
from .models import CinemaRoom

import helpers

router = Router()


@router.post('', response={201: CinemaRoomSchema, 500: MessageSchema}, auth=helpers.auth_required)
def create_cinema_room(request, payload: CinemaRoomCreateSchema):
    try:
        cinema_room = CinemaRoom.objects.create(**payload.dict())

        return 201, cinema_room
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during creating cinema room."}
    

@router.get('', response={200: list[CinemaRoomSchema], 404: MessageSchema, 500: MessageSchema}, auth=helpers.auth_required)
def get_cienema_rooms(request):
    try:
        cienema_rooms = CinemaRoom.objects.all()

        return 200, cienema_rooms
    except CinemaRoom.DoesNotExist:
        return 404, {"message", {"Cinema rooms not found."}}
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during fetching cinema rooms."}