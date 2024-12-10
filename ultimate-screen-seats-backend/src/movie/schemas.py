from datetime import date
from typing import Optional
from ninja import Schema
from pydantic import fields


class MovieSchema(Schema):
    id: int
    title: str
    description: str
    genre: str
    movie_length: int
    age_classification: int
    image: str
    release_date: Optional[date]

    class Config:
        form_atributes = True

class MovieCreateSchema(Schema):
    title: str
    description: Optional[str]
    genre: str
    movie_length: int
    age_classification: int
    image: str
    release_date: Optional[date]