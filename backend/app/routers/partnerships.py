"""Partnership API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.crud import partnership as crud
from app.database import get_db
from app.models import SciencePark, User
from app.schemas.partnership import (
    KooperationStatusUpdate,
    PartnershipCreate,
    PartnershipResponse,
    PartnershipUpdate,
)

router = APIRouter(prefix="/api/partnerships", tags=["partnerships"])


def _to_response(park: SciencePark) -> PartnershipResponse:
    uni = park.university
    return PartnershipResponse(
        id=park.id,
        park_name=park.name,
        land=park.land,
        stadt=park.stadt,
        gruendungsjahr=park.gruendungsjahr,
        bisherige_kooperation=park.bisherige_kooperation,
        datum=park.datum,
        themen=park.themen or [],
        bemerkungen=park.bemerkungen,
        park_ansprechpartner=park.ansprechpartner,
        kontaktdetails=park.kontaktdetails,
        webpraesenz=park.webpraesenz,
        universitaet_name=uni.name if uni else "",
        standort=uni.standort if uni else None,
        forschungsschwerpunkte=uni.forschungsschwerpunkte or [] if uni else [],
        uni_ansprechpartner=uni.ansprechpartner if uni else None,
        website=uni.website if uni else None,
        created_at=park.created_at,
        updated_at=park.updated_at,
    )


@router.get("", response_model=list[PartnershipResponse])
def list_partnerships(
    search: str | None = Query(default=None),
    land: str | None = Query(default=None),
    kooperation: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> list[PartnershipResponse]:
    parks = crud.get_partnerships(db, search=search, land=land, kooperation=kooperation)
    return [_to_response(p) for p in parks]


@router.get("/{partnership_id}", response_model=PartnershipResponse)
def get_partnership(
    partnership_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> PartnershipResponse:
    park = crud.get_partnership(db, partnership_id)
    if not park:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partnerschaft nicht gefunden.",
        )
    return _to_response(park)


@router.post(
    "", response_model=PartnershipResponse, status_code=status.HTTP_201_CREATED
)
def create_partnership(
    data: PartnershipCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("readwrite")),
) -> PartnershipResponse:
    park = crud.create_partnership(db, data)
    return _to_response(park)


@router.put("/{partnership_id}", response_model=PartnershipResponse)
def update_partnership(
    partnership_id: int,
    data: PartnershipUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("readwrite")),
) -> PartnershipResponse:
    park = crud.update_partnership(db, partnership_id, data)
    if not park:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partnerschaft nicht gefunden.",
        )
    return _to_response(park)


@router.patch(
    "/{partnership_id}/status", response_model=PartnershipResponse
)
def update_status(
    partnership_id: int,
    data: KooperationStatusUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("readwrite")),
) -> PartnershipResponse:
    park = crud.update_status(db, partnership_id, data.bisherige_kooperation)
    if not park:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partnerschaft nicht gefunden.",
        )
    return _to_response(park)


@router.delete(
    "/{partnership_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_partnership(
    partnership_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("admin")),
) -> None:
    deleted = crud.delete_partnership(db, partnership_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Partnerschaft nicht gefunden.",
        )
