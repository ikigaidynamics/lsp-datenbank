"""CSV and JSON export endpoints."""

import csv
import io
import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.crud import partnership as crud
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/api/export", tags=["export"])

CSV_COLUMNS = [
    "id", "parkName", "land", "stadt", "gruendungsjahr",
    "bisherigeKooperation", "datum", "themen", "bemerkungen",
    "parkAnsprechpartner", "kontaktdetails", "webpraesenz",
    "universitaetName", "standort", "forschungsschwerpunkte",
    "uniAnsprechpartner", "website",
]


def _park_to_dict(park) -> dict:
    uni = park.university
    return {
        "id": park.id,
        "parkName": park.name,
        "land": park.land,
        "stadt": park.stadt,
        "gruendungsjahr": park.gruendungsjahr,
        "bisherigeKooperation": park.bisherige_kooperation,
        "datum": park.datum,
        "themen": "; ".join(park.themen or []),
        "bemerkungen": park.bemerkungen or "",
        "parkAnsprechpartner": park.ansprechpartner or "",
        "kontaktdetails": park.kontaktdetails or "",
        "webpraesenz": park.webpraesenz or "",
        "universitaetName": uni.name if uni else "",
        "standort": uni.standort or "" if uni else "",
        "forschungsschwerpunkte": "; ".join(
            uni.forschungsschwerpunkte or [] if uni else []
        ),
        "uniAnsprechpartner": uni.ansprechpartner or "" if uni else "",
        "website": uni.website or "" if uni else "",
    }


@router.get("/csv")
def export_csv(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> StreamingResponse:
    parks = crud.get_partnerships(db)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=CSV_COLUMNS, delimiter=";")
    writer.writeheader()
    for park in parks:
        writer.writerow(_park_to_dict(park))

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": "attachment; filename=partnerschaften.csv"
        },
    )


@router.get("/json")
def export_json(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> StreamingResponse:
    parks = crud.get_partnerships(db)
    data = [_park_to_dict(park) for park in parks]

    output = json.dumps(data, ensure_ascii=False, indent=2)
    return StreamingResponse(
        iter([output]),
        media_type="application/json; charset=utf-8",
        headers={
            "Content-Disposition": "attachment; filename=partnerschaften.json"
        },
    )
