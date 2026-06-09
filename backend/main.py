from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.mongodb import close_database, ensure_indexes
from routes import auth, health, posters, recommendations
from utils.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.mongodb_uri:
        await ensure_indexes()
    yield
    await close_database()


app = FastAPI(title="IMovie Recommender API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(recommendations.router)
app.include_router(posters.router)

app.mount("/posters", StaticFiles(directory=settings.posters_dir), name="posters")
app.mount(
    "/.well-known",
    StaticFiles(directory=settings.base_dir / ".well-known"),
    name="static-well-known",
)
