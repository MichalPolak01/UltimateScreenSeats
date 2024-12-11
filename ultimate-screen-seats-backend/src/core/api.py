from ninja_extra import NinjaExtraAPI

api = NinjaExtraAPI(urls_namespace="myapi")


api.add_router("/auth", "authentication.api.router", tags=["Authentication"])
api.add_router("/movie", "movie.api.router", tags=["Movie"])
api.add_router("/cinema-room", "cinema_room.api.router", tags=["Cinema Room"])