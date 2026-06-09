import asyncio
import getpass

from database.mongodb import close_database, get_database


async def main() -> None:
    email = input("Email: ").strip().lower()
    password = getpass.getpass("Password: ")

    from utils.security import verify_password

    db = get_database()
    user = await db.users.find_one({"email": email})

    if not user:
        print("No user found with that email.")
    else:
        password_hash = user.get("password_hash")
        print(f"User found: {user.get('_id')}")
        print(f"Has password_hash: {bool(password_hash)}")
        print(f"Stored refresh token count: {len(user.get('refresh_tokens', []))}")
        print(f"Password matches: {verify_password(password, password_hash) if password_hash else False}")

    await close_database()


if __name__ == "__main__":
    asyncio.run(main())
