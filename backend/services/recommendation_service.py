import json

import pandas as pd

from schemas.recommendations import WatchedMovies
from utils.config import get_settings

settings = get_settings()

with settings.movies_path.open("r", encoding="utf-8") as f:
    movies_data = json.load(f)

title_to_id_map = {movie["title"]: movie["movieId"] for movie in movies_data}
item_similarity_df = pd.read_csv(settings.similarity_path, index_col=0)
print("item_similarity_df cached in memory")


def get_similar_movies(movie_name: str, user_rating: float) -> pd.Series:
    try:
        similar_score = item_similarity_df[movie_name] * (user_rating - 2.5)
        return similar_score.sort_values(ascending=False)
    except KeyError:
        print("No movie is present in the model")
        return pd.Series(dtype="float64")


def _is_seen(recommended_movie: str, watched_movies: WatchedMovies) -> bool:
    return any(recommended_movie == movie.title for movie in watched_movies.movies.values())


def build_recommendations(watched_movies: WatchedMovies) -> dict:
    similar_movies = pd.DataFrame()

    for movie in watched_movies.movies.values():
        similar_movie_series = get_similar_movies(movie.title, movie.rating)
        similar_movie_df = similar_movie_series.to_frame(name=None).T
        similar_movies = pd.concat([similar_movies, similar_movie_df], ignore_index=True)

    if similar_movies.empty:
        return {"recommended_movies": [], "posters": {}}

    all_recommend = similar_movies.sum().sort_values(ascending=False)
    recommended_movies = [
        movie for movie in all_recommend.index if not _is_seen(movie, watched_movies)
    ][: watched_movies.num_movies]

    poster_urls = {}
    for movie in recommended_movies:
        movie_id = title_to_id_map.get(movie)
        poster_file = settings.posters_dir / f"{movie_id}.jpg" if movie_id else None
        if poster_file and poster_file.exists():
            poster_urls[movie] = f"{settings.api_base_url}/posters/{poster_file.name}"
        else:
            poster_urls[movie] = f"{settings.api_base_url}/posters/default.jpg"

    return {"recommended_movies": recommended_movies, "posters": poster_urls}
