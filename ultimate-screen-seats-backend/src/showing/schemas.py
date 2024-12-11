# from ninja import Schema
# from datetime import datetime
# from decimal import Decimal
# from pydantic import BaseModel, Field, field_validator

# from cinema_room.schemas import CinemaRoomSchema
# from movie.schemas import MovieSchema


# class ShowingSchema(Schema):
#     id: int
#     movie: MovieSchema
#     cinema_room: CinemaRoomSchema
#     date = datetime
#     ticket_price = Decimal 

#     class Config:
#         from_attributes = True

# class ShowingCreateSchema(Schema):
#     id: int
#     movie_id: int
#     cinema_room_id: int
#     date: datetime = Field(..., description="The date and time of the showing.")
#     ticket_price: Decimal = Field()


#     # @field_validator("date")
#     # def validate_date_field(cls, value):
#     #     return validate_date(value)
    
#     @field_validator("ticket_price")
#     def validate_ticket_price(cls, value):
#         return validate_ticket_price(value)



# # def validate_date(value):
# #     if value <= datetime.now():
# #         raise ValueError("The date must be in the future.")
# #     return value

# def validate_ticket_price(value):
#     if value < 0 or value.as_tuple().exponent < -2:
#         raise ValueError("Ticket price must be a positive value with up to 2 decimal places.")
#     return value

# # from pydantic import BaseModel, Field, ConfigDict, field_validator
# # from datetime import datetime
# # from decimal import Decimal


# # class ShowingBase(BaseModel):
# #     movie_id: int = Field(..., description="The ID of the movie.")
# #     cinema_room_id: int = Field(..., description="The ID of the cinema room.")
# #     date: datetime = Field(..., description="The date and time of the showing.")
# #     ticket_price: Decimal = Field(..., description="The price of a ticket.")

# #     model_config = ConfigDict(from_attributes=True)

# #     @field_validator("date")
# #     def validate_date(cls, value: datetime):
# #         if value <= datetime.now():
# #             raise ValueError("The date must be in the future.")
# #         return value

# #     @field_validator("ticket_price")
# #     def validate_ticket_price(cls, value: Decimal):
# #         if value < 0 or value.as_tuple().exponent < -2:
# #             raise ValueError("Ticket price must be a positive value with up to 2 decimal places.")
# #         return value


# # class ShowingCreateSchema(ShowingBase):
# #     pass


# # class ShowingSchema(ShowingBase):
# #     id: int


from ninja import Schema
from datetime import datetime
from decimal import Decimal
from pydantic import Field, field_validator

from cinema_room.schemas import CinemaRoomSchema
from movie.schemas import MovieSchema


class ShowingSchema(Schema):
    id: int
    movie: MovieSchema
    cinema_room: CinemaRoomSchema
    date: datetime  # Correctly annotated
    ticket_price: Decimal  # Correctly annotated

    class Config:
        from_attributes = True


class ShowingCreateSchema(Schema):
    movie_id: int
    cinema_room_id: int
    date: datetime = Field(..., description="The date and time of the showing.")  # Field with proper annotation
    ticket_price: Decimal = Field(..., description="The price of a ticket.")  # Field with proper annotation

    # Optional validators for additional checks
    @field_validator("ticket_price")
    def validate_ticket_price(cls, value):
        return validate_ticket_price(value)
    
    def validate_date(value):
        if value <= datetime.now():
            raise ValueError("The date must be in the future.")
        return value


# Validator function
def validate_ticket_price(value: Decimal):
    if value < 0 or value.as_tuple().exponent < -2:
        raise ValueError("Ticket price must be a positive value with up to 2 decimal places.")
    return value

def validate_date(value):
    if value <= datetime.now():
        raise ValueError("The date must be in the future.")
    return value