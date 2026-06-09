from fastapi import HTTPException

from utils.config import get_settings

settings = get_settings()
VALID_EXTENSIONS = (".jpg", ".jpeg", ".png")


def list_posters(limit: int = 10, offset: int = 0) -> list[str]:
    try:
        image_files = [
            f
            for f in settings.posters_dir.iterdir()
            if f.is_file() and f.suffix.lower() in VALID_EXTENSIONS
        ]
        image_files.sort(key=lambda x: int(x.stem))
        selected_images = image_files[offset : offset + limit]
        return [f"{settings.api_base_url}/posters/{image.name}" for image in selected_images]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def list_posters_by_id(ids: str) -> list[str]:
    try:
        movie_ids = ids.split(",")
        image_files = [
            f for f in settings.posters_dir.iterdir() if f.is_file() and f.stem in movie_ids
        ]
        image_files.sort(key=lambda x: movie_ids.index(x.stem))
        return [f"{settings.api_base_url}/posters/{image.name}" for image in image_files]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
