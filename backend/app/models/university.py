from datetime import datetime

from sqlalchemy import ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class University(Base):
    __tablename__ = "universitaeten"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    science_park_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("science_parks.id"), unique=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    standort: Mapped[str | None] = mapped_column(String(255))
    forschungsschwerpunkte: Mapped[list[str] | None] = mapped_column(
        JSON, default=list
    )
    ansprechpartner: Mapped[str | None] = mapped_column(String(255))
    website: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    science_park: Mapped["SciencePark"] = relationship(
        "SciencePark", back_populates="university"
    )
