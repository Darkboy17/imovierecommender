from datetime import datetime, timedelta, timezone

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from database.mongodb import get_database
from schemas.auth import AuthRequest, LoginRequest, TokenResponse, UserResponse
from utils.config import get_settings
from utils.security import create_token, decode_token, hash_password, hash_token, verify_password


def _serialize_user(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user.get("name"),
    )


def _token_pair(user_id: str) -> tuple[str, str, int]:
    settings = get_settings()
    access_expires = timedelta(minutes=settings.access_token_minutes)
    refresh_expires = timedelta(days=settings.refresh_token_days)
    return (
        create_token(user_id, "access", access_expires),
        create_token(user_id, "refresh", refresh_expires),
        int(access_expires.total_seconds()),
    )


async def register_user(payload: AuthRequest) -> TokenResponse:
    db = get_database()
    now = datetime.now(timezone.utc)
    user_doc = {
        "email": payload.email.lower(),
        "name": payload.name,
        "password_hash": hash_password(payload.password),
        "refresh_tokens": [],
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = await db.users.insert_one(user_doc)
    except DuplicateKeyError as exc:
        raise ValueError("An account with this email already exists") from exc

    user_doc["_id"] = result.inserted_id
    return await issue_tokens(user_doc)


async def login_user(payload: LoginRequest) -> TokenResponse:
    db = get_database()
    user = await db.users.find_one({"email": payload.email.lower()})
    password_hash = user.get("password_hash") if user else None
    if not user or not password_hash:
        raise ValueError("Invalid email or password")
    if not verify_password(payload.password, password_hash):
        raise ValueError("Invalid email or password")
    return await issue_tokens(user)


async def issue_tokens(user: dict) -> TokenResponse:
    db = get_database()
    user_id = str(user["_id"])
    access_token, refresh_token, expires_in = _token_pair(user_id)
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$push": {"refresh_tokens": hash_token(refresh_token)},
            "$set": {"updated_at": datetime.now(timezone.utc)},
        },
    )
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        user=_serialize_user(user),
    )


async def refresh_tokens(refresh_token: str) -> TokenResponse:
    payload = decode_token(refresh_token, "refresh")
    db = get_database()
    current_refresh_hash = hash_token(refresh_token)
    user = await db.users.find_one(
        {"_id": ObjectId(payload["sub"]), "refresh_tokens": current_refresh_hash}
    )
    if not user:
        raise ValueError("Refresh token is no longer valid")

    access_token, new_refresh_token, expires_in = _token_pair(str(user["_id"]))
    next_refresh_tokens = [
        token_hash for token_hash in user.get("refresh_tokens", []) if token_hash != current_refresh_hash
    ]
    next_refresh_tokens.append(hash_token(new_refresh_token))

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "refresh_tokens": next_refresh_tokens,
                "updated_at": datetime.now(timezone.utc),
            },
        },
    )
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=expires_in,
        user=_serialize_user(user),
    )


async def logout_user(user_id: str, refresh_token: str | None) -> None:
    db = get_database()
    if refresh_token:
        update = {
            "$pull": {"refresh_tokens": hash_token(refresh_token)},
            "$set": {"updated_at": datetime.now(timezone.utc)},
        }
    else:
        update = {"$set": {"refresh_tokens": [], "updated_at": datetime.now(timezone.utc)}}
    await db.users.update_one({"_id": ObjectId(user_id)}, update)


async def get_user_by_id(user_id: str) -> UserResponse | None:
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return _serialize_user(user) if user else None
