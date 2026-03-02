from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# --- Create ---

class PartnershipCreate(BaseModel):
    # Science Park
    park_name: str = Field(min_length=1, max_length=255)
    land: str = Field(min_length=1, max_length=100)
    stadt: str = Field(min_length=1, max_length=100)
    gruendungsjahr: int | None = None
    bisherige_kooperation: Literal[
        "Keine", "Geplant", "Aktiv", "Abgeschlossen"
    ] | None = None
    datum: str | None = None
    themen: list[str] = Field(default_factory=list)
    bemerkungen: str | None = None
    park_ansprechpartner: str | None = None
    kontaktdetails: str | None = None
    webpraesenz: str | None = None
    # University
    universitaet_name: str = Field(min_length=1, max_length=255)
    standort: str | None = None
    forschungsschwerpunkte: list[str] = Field(default_factory=list)
    uni_ansprechpartner: str | None = None
    website: str | None = None


# --- Update ---

class PartnershipUpdate(BaseModel):
    # Science Park (all optional)
    park_name: str | None = Field(default=None, min_length=1, max_length=255)
    land: str | None = Field(default=None, min_length=1, max_length=100)
    stadt: str | None = Field(default=None, min_length=1, max_length=100)
    gruendungsjahr: int | None = None
    bisherige_kooperation: Literal[
        "Keine", "Geplant", "Aktiv", "Abgeschlossen"
    ] | None = None
    datum: str | None = None
    themen: list[str] | None = None
    bemerkungen: str | None = None
    park_ansprechpartner: str | None = None
    kontaktdetails: str | None = None
    webpraesenz: str | None = None
    # University (all optional)
    universitaet_name: str | None = Field(
        default=None, min_length=1, max_length=255
    )
    standort: str | None = None
    forschungsschwerpunkte: list[str] | None = None
    uni_ansprechpartner: str | None = None
    website: str | None = None


# --- Kooperation status ---

class KooperationStatusUpdate(BaseModel):
    bisherige_kooperation: Literal[
        "Keine", "Geplant", "Aktiv", "Abgeschlossen"
    ]


# --- Response (camelCase) ---

class PartnershipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    # Science Park
    park_name: str = Field(alias="parkName")
    land: str
    stadt: str
    gruendungsjahr: int | None = Field(default=None, alias="gruendungsjahr")
    bisherige_kooperation: str | None = Field(
        default=None, alias="bisherigeKooperation"
    )
    datum: str | None = None
    themen: list[str] = Field(default_factory=list)
    bemerkungen: str | None = None
    park_ansprechpartner: str | None = Field(
        default=None, alias="parkAnsprechpartner"
    )
    kontaktdetails: str | None = None
    webpraesenz: str | None = None
    # University
    universitaet_name: str = Field(alias="universitaetName")
    standort: str | None = None
    forschungsschwerpunkte: list[str] = Field(
        default_factory=list, alias="forschungsschwerpunkte"
    )
    uni_ansprechpartner: str | None = Field(
        default=None, alias="uniAnsprechpartner"
    )
    website: str | None = None
    # Timestamps
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
