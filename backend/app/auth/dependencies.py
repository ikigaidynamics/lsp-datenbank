"""FastAPI dependencies for authentication and role-based access."""

from collections.abc import Callable

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import validate_session
from app.database import get_db
from app.models import User

ROLE_HIERARCHY = {"readonly": 0, "readwrite": 1, "admin": 2}


def get_current_user(
    session_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nicht authentifiziert.",
        )

    user_id = validate_session(session_token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sitzung abgelaufen oder ungültig.",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Benutzer nicht gefunden.",
        )

    return user


def require_role(min_role: str) -> Callable:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        user_level = ROLE_HIERARCHY.get(current_user.role, -1)
        required_level = ROLE_HIERARCHY.get(min_role, 99)

        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Keine Berechtigung für diese Aktion.",
            )

        return current_user

    return dependency
