"""User management endpoints (admin only)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.crud import user as crud
from app.database import get_db
from app.models import User
from app.schemas.user import UserCreate, UserResponse, UserRoleUpdate

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("admin")),
) -> list[UserResponse]:
    return crud.get_users(db)


@router.post(
    "", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("admin")),
) -> UserResponse:
    existing = crud.get_user_by_username(db, data.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Benutzername bereits vergeben.",
        )
    return crud.create_user(db, data)


@router.put("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("admin")),
) -> UserResponse:
    user = crud.update_role(db, user_id, data.role)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Benutzer nicht gefunden.",
        )
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("admin")),
) -> None:
    deleted = crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Benutzer nicht gefunden.",
        )
