from ninja_extra import Router

from .schemas import CinemaRoomSchema, CinemaRoomCreateSchema
from core.schemas import MessageSchema
from .models import CinemaRoom

router = Router()


@router.post('', response={201: CinemaRoomSchema, 500: MessageSchema})
def create_cinema_room(request, payload: CinemaRoomCreateSchema):
    try:
        cinema_room = CinemaRoom.objects.create(**payload.dict())

        return 201, cinema_room
    except Exception as e:
        return 500, {"message": "An unexpected error ocurred during creating cinema room."}