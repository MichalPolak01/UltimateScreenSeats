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
    release_date: date

    class Config:
        form_atributes = True

class MovieCreateSchema(Schema):
    title: str
    description: Optional[str] = None
    genre: str
    movie_length: int
    age_classification: int
    image: str
    release_date: date


class MovieUpdateSchema(Schema):
    title: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[str] = None
    movie_length: Optional[int] = None
    age_classification: Optional[int] = None
    image: Optional[str] = None
    release_date: Optional[date] = None