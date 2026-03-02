from datetime import datetime

from sqlalchemy import CheckConstraint, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

ROLE_VALUES = ("readonly", "readwrite", "admin")


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            f"role IN {ROLE_VALUES!r}",
            name="ck_users_role",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    display_name: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
