from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/")
async def read_root() -> str:
    return "Welcome to Movie Recommender API"
