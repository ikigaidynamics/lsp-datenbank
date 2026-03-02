"""CRUD operations for partnerships (SciencePark + University)."""

from datetime import datetime, timezone

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.models import SciencePark, University
from app.schemas.partnership import (
    PartnershipCreate,
    PartnershipUpdate,
)

# Fields that belong to the park vs. the university
PARK_FIELDS = {
    "park_name": "name",
    "land": "land",
    "stadt": "stadt",
    "gruendungsjahr": "gruendungsjahr",
    "bisherige_kooperation": "bisherige_kooperation",
    "datum": "datum",
    "themen": "themen",
    "bemerkungen": "bemerkungen",
    "park_ansprechpartner": "ansprechpartner",
    "kontaktdetails": "kontaktdetails",
    "webpraesenz": "webpraesenz",
}

UNI_FIELDS = {
    "universitaet_name": "name",
    "standort": "standort",
    "forschungsschwerpunkte": "forschungsschwerpunkte",
    "uni_ansprechpartner": "ansprechpartner",
    "website": "website",
}


def _eager_query(db: Session):
    return db.query(SciencePark).options(joinedload(SciencePark.university))


def get_partnerships(
    db: Session,
    search: str | None = None,
    land: str | None = None,
    kooperation: str | None = None,
) -> list[SciencePark]:
    query = _eager_query(db)

    if land:
        query = query.filter(SciencePark.land == land)

    if kooperation:
        query = query.filter(SciencePark.bisherige_kooperation == kooperation)

    if search:
        term = f"%{search}%"
        query = query.outerjoin(University).filter(
            or_(
                SciencePark.name.ilike(term),
                SciencePark.stadt.ilike(term),
                University.name.ilike(term),
            )
        )

    return query.order_by(SciencePark.id).all()


def get_partnership(db: Session, park_id: int) -> SciencePark | None:
    return _eager_query(db).filter(SciencePark.id == park_id).first()


def create_partnership(
    db: Session, data: PartnershipCreate
) -> SciencePark:
    park_data = {
        db_col: getattr(data, schema_field)
        for schema_field, db_col in PARK_FIELDS.items()
    }
    park = SciencePark(**park_data)
    db.add(park)
    db.flush()

    uni_data = {
        db_col: getattr(data, schema_field)
        for schema_field, db_col in UNI_FIELDS.items()
    }
    uni_data["science_park_id"] = park.id
    db.add(University(**uni_data))

    db.commit()
    db.refresh(park)
    return park


def update_partnership(
    db: Session, park_id: int, data: PartnershipUpdate
) -> SciencePark | None:
    park = get_partnership(db, park_id)
    if not park:
        return None

    changes = data.model_dump(exclude_unset=True)
    now = datetime.now(timezone.utc)

    # Update park fields
    park_changed = False
    for schema_field, db_col in PARK_FIELDS.items():
        if schema_field in changes:
            setattr(park, db_col, changes[schema_field])
            park_changed = True
    if park_changed:
        park.updated_at = now

    # Update university fields
    uni = park.university
    if uni:
        uni_changed = False
        for schema_field, db_col in UNI_FIELDS.items():
            if schema_field in changes:
                setattr(uni, db_col, changes[schema_field])
                uni_changed = True
        if uni_changed:
            uni.updated_at = now

    db.commit()
    db.refresh(park)
    return park


def update_status(
    db: Session, park_id: int, status: str
) -> SciencePark | None:
    park = get_partnership(db, park_id)
    if not park:
        return None

    park.bisherige_kooperation = status
    park.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(park)
    return park


def delete_partnership(db: Session, park_id: int) -> bool:
    park = db.query(SciencePark).filter(SciencePark.id == park_id).first()
    if not park:
        return False

    db.delete(park)
    db.commit()
    return True
