"""Password hashing and in-memory session management."""

import secrets
from datetime import datetime, timezone

import bcrypt

from app.config import settings

# session_token -> {user_id, created_at}
_sessions: dict[str, dict] = {}


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_session(user_id: int) -> str:
    token = secrets.token_hex(32)
    _sessions[token] = {
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc),
    }
    return token


def validate_session(token: str) -> int | None:
    session = _sessions.get(token)
    if not session:
        return None

    age = (datetime.now(timezone.utc) - session["created_at"]).total_seconds()
    if age > settings.SESSION_MAX_AGE:
        _sessions.pop(token, None)
        return None

    return session["user_id"]


def delete_session(token: str) -> None:
    _sessions.pop(token, None)
