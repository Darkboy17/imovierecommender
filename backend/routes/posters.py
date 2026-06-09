from fastapi import APIRouter

from services.poster_service import list_posters, list_posters_by_id

router = APIRouter(tags=["posters"])


@router.get("/movie-posters/", response_model=list[str])
async def get_movie_posters(limit: int = 10, offset: int = 0) -> list[str]:
    return list_posters(limit=limit, offset=offset)


@router.get("/movie-posters-ids/")
async def get_movie_posters_by_id(ids: str) -> list[str]:
    return list_posters_by_id(ids)
