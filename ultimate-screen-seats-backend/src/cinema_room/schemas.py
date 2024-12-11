from typing import List
from ninja import Schema


class CinemaRoomSchema(Schema):
    id: int
    name: str
    seat_layout: List[List[int]]
    number_of_seats: int

    class Config:
        from_attributes = True

class CinemaRoomCreateSchema(Schema):
    name: str
    seat_layout: List[List[int]]