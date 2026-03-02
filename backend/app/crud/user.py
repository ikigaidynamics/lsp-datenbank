"""CRUD operations for users."""

import bcrypt
from sqlalchemy.orm import Session

from app.models import User
from app.schemas.user import UserCreate


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def get_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.id).all()


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, data: UserCreate) -> User:
    user = User(
        username=data.username,
        password_hash=_hash_password(data.password),
        role=data.role,
        display_name=data.display_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_role(db: Session, user_id: int, role: str) -> User | None:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    user.role = role
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> bool:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False

    db.delete(user)
    db.commit()
    return True
