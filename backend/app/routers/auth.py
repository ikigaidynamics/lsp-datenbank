"""Authentication endpoints."""

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.security import create_session, delete_session, verify_password
from app.crud.user import get_user_by_username, update_profile
from app.database import get_db
from app.models import User
from app.schemas.auth import AuthResponse, LoginRequest, ProfileUpdate

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
        secure=True,
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
    session_token: str = Cookie(),
    current_user: User = Depends(get_current_user),
) -> None:
    delete_session(session_token)
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


@router.put("/profile", response_model=AuthResponse)
def update_user_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AuthResponse:
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aktuelles Passwort ist falsch.",
        )

    if data.new_username is not None:
        existing = get_user_by_username(db, data.new_username)
        if existing and existing.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Benutzername ist bereits vergeben.",
            )

    updated = update_profile(
        db,
        user_id=current_user.id,
        new_username=data.new_username,
        new_display_name=data.new_display_name,
        new_password=data.new_password,
    )

    return AuthResponse(
        id=updated.id,
        username=updated.username,
        role=updated.role,
        display_name=updated.display_name,
    )
