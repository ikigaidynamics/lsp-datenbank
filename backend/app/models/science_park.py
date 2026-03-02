from datetime import datetime

from sqlalchemy import JSON, CheckConstraint, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

KOOPERATION_VALUES = ("Keine", "Geplant", "Aktiv", "Abgeschlossen")


class SciencePark(Base):
    __tablename__ = "science_parks"
    __table_args__ = (
        CheckConstraint(
            f"bisherige_kooperation IN {KOOPERATION_VALUES!r}",
            name="ck_science_parks_kooperation",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    land: Mapped[str] = mapped_column(String(100), nullable=False)
    stadt: Mapped[str] = mapped_column(String(100), nullable=False)
    gruendungsjahr: Mapped[int | None] = mapped_column(Integer)
    bisherige_kooperation: Mapped[str | None] = mapped_column(String(20))
    datum: Mapped[str | None] = mapped_column(String(10))
    themen: Mapped[list[str] | None] = mapped_column(JSON, default=list)
    bemerkungen: Mapped[str | None] = mapped_column(Text)
    ansprechpartner: Mapped[str | None] = mapped_column(String(255))
    kontaktdetails: Mapped[str | None] = mapped_column(Text)
    webpraesenz: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    university: Mapped["University | None"] = relationship(
        "University", back_populates="science_park", uselist=False, cascade="all, delete-orphan"
    )
