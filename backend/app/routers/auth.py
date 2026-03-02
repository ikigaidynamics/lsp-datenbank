"""Authentication endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.security import create_session, delete_session, verify_password
from app.crud.user import get_user_by_username
from app.database import get_db
from app.models import User
from app.schemas.auth import AuthResponse, LoginRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthResponse:
    user = get_user_by_username(db, data.username)
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Benutzername oder Passwort falsch.",
        )

    token = create_session(user.id)
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=8 * 3600,
    )

    return AuthResponse(
        id=user.id,
        username=user.username,
        role=user.role,
        display_name=user.display_name,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    current_user: User = Depends(get_current_user),
) -> None:
    # Cookie will be read by the dependency; delete it from response
    response.delete_cookie("session_token")


@router.get("/me", response_model=AuthResponse)
def me(
    current_user: User = Depends(get_current_user),
) -> AuthResponse:
    return AuthResponse(
        id=current_user.id,
        username=current_user.username,
        role=current_user.role,
        display_name=current_user.display_name,
    )
