from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from utils.config import get_settings

_client: AsyncIOMotorClient | None = None


def get_database() -> AsyncIOMotorDatabase:
    settings = get_settings()
    if not settings.mongodb_uri:
        raise RuntimeError("MONGODB_URI is not configured")

    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri)
    return _client[settings.mongodb_database]


async def ensure_indexes() -> None:
    db = get_database()
    await db.users.create_index("email", unique=True)


async def close_database() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
