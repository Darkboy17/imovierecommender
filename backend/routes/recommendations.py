from fastapi import APIRouter, Depends

from routes.dependencies import get_current_user
from schemas.auth import UserResponse
from schemas.recommendations import WatchedMovies
from services.recommendation_service import build_recommendations

router = APIRouter(tags=["recommendations"])


@router.post("/recommendations/")
async def get_recommendations(
    watched_movies: WatchedMovies,
    _: UserResponse = Depends(get_current_user),
) -> dict:
    return build_recommendations(watched_movies)
