from pydantic import BaseModel


class WatchedMovie(BaseModel):
    title: str
    rating: float


class WatchedMovies(BaseModel):
    movies: dict[str, WatchedMovie]
    num_movies: int
