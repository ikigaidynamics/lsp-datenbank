"""Seed the database with demo data from the frontend mockData."""

import bcrypt
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import SciencePark, University, User

SEED_PARKS = [
    {
        "park": {
            "name": "BioCity Leipzig",
            "land": "Deutschland",
            "stadt": "Leipzig",
            "gruendungsjahr": 2003,
            "bisherige_kooperation": "Aktiv",
            "datum": "2024-03-15",
            "themen": ["Biotechnologie", "Life Sciences", "Medizintechnik"],
            "bemerkungen": "Langfristige Zusammenarbeit im Bereich Biotechnologie",
            "ansprechpartner": "Dr. Petra Meyer",
            "kontaktdetails": "p.meyer@biocity-leipzig.de | +49 341 9876543",
            "webpraesenz": "https://www.biocity-leipzig.de",
        },
        "uni": {
            "name": "Universität Leipzig",
            "standort": "Leipzig, Sachsen, Deutschland",
            "forschungsschwerpunkte": [
                "Biotechnologie", "Medizin", "Life Sciences", "Molekularbiologie",
            ],
            "ansprechpartner": "Prof. Michael Weber",
            "website": "https://www.uni-leipzig.de",
        },
    },
    {
        "park": {
            "name": "Wrocław Technology Park",
            "land": "Polen",
            "stadt": "Wrocław",
            "gruendungsjahr": 2005,
            "bisherige_kooperation": "Geplant",
            "datum": "2025-01-10",
            "themen": ["Informatik", "KI", "Maschinenbau"],
            "bemerkungen": "Vorbereitung eines gemeinsamen Forschungsprojekts",
            "ansprechpartner": "Prof. Andrzej Kowalski",
            "kontaktdetails": "a.kowalski@techpark.pl | +48 71 1234567",
            "webpraesenz": "https://www.techpark.pl",
        },
        "uni": {
            "name": "Politechnika Wrocławska",
            "standort": "Wrocław, Niederschlesien, Polen",
            "forschungsschwerpunkte": [
                "Informatik", "Maschinenbau", "Elektrotechnik", "Smart Cities",
            ],
            "ansprechpartner": "Dr. Katarzyna Nowak",
            "website": "https://pwr.edu.pl",
        },
    },
    {
        "park": {
            "name": "Science Park Graz",
            "land": "Österreich",
            "stadt": "Graz",
            "gruendungsjahr": 2002,
            "bisherige_kooperation": "Aktiv",
            "datum": "2023-09-20",
            "themen": ["Mobilität", "Nachhaltigkeit", "Energie"],
            "bemerkungen": "Regelmäßiger Wissensaustausch, jährliche Treffen",
            "ansprechpartner": "Mag. Christina Huber",
            "kontaktdetails": "c.huber@sciencepark-graz.at | +43 316 987654",
            "webpraesenz": "https://www.sciencepark-graz.at",
        },
        "uni": {
            "name": "TU Graz",
            "standort": "Graz, Steiermark, Österreich",
            "forschungsschwerpunkte": [
                "Mobilität", "Künstliche Intelligenz",
                "Nachhaltigkeit", "Digitalisierung",
            ],
            "ansprechpartner": "Ing. Thomas Müller",
            "website": "https://www.tugraz.at",
        },
    },
    {
        "park": {
            "name": "Brno Technology Park",
            "land": "Tschechien",
            "stadt": "Brno",
            "gruendungsjahr": 2007,
            "bisherige_kooperation": "Abgeschlossen",
            "datum": "2022-11-30",
            "themen": ["Photonik", "Nanotechnologie", "Quantentechnologie"],
            "bemerkungen": "Erfolgreiches Projekt 2020-2022 abgeschlossen",
            "ansprechpartner": "Dr. Pavel Novák",
            "kontaktdetails": "p.novak@brnotp.cz | +420 541 123456",
            "webpraesenz": "https://www.brnotp.cz",
        },
        "uni": {
            "name": "Masaryk University",
            "standort": "Brno, Südmähren, Tschechien",
            "forschungsschwerpunkte": [
                "Photonik", "Nanotechnologie", "Quantenphysik", "Bioinformatik",
            ],
            "ansprechpartner": "Dr. Jan Dvořák",
            "website": "https://www.muni.cz",
        },
    },
    {
        "park": {
            "name": "Lausitz Science Park",
            "land": "Deutschland",
            "stadt": "Cottbus",
            "gruendungsjahr": 2020,
            "bisherige_kooperation": "Aktiv",
            "datum": "2020-06-01",
            "themen": ["Energie", "Strukturwandel", "Innovation"],
            "bemerkungen": "Hauptstandort und Heimatbasis",
            "ansprechpartner": "Sandra Wagner",
            "kontaktdetails": "s.wagner@lausitz-sp.de | +49 355 123456",
            "webpraesenz": "https://www.lausitz-sciencepark.de",
        },
        "uni": {
            "name": "BTU Cottbus-Senftenberg",
            "standort": "Cottbus, Brandenburg, Deutschland",
            "forschungsschwerpunkte": [
                "Energie", "Umwelt", "Materialwissenschaften",
                "Informations- und Kommunikationstechnologie",
            ],
            "ansprechpartner": "Dr. Anna Schmidt",
            "website": "https://www.b-tu.de",
        },
    },
]

SEED_USERS = [
    {
        "username": "admin",
        "password": "admin123",
        "role": "admin",
        "display_name": "Administrator",
    },
    {
        "username": "sandra",
        "password": "sandra123",
        "role": "readwrite",
        "display_name": "Sandra Wagner",
    },
    {
        "username": "gast",
        "password": "gast123",
        "role": "readonly",
        "display_name": "Gast-Zugang",
    },
]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def seed_db(db: Session) -> None:
    # Parks + Universities
    for entry in SEED_PARKS:
        park = SciencePark(**entry["park"])
        db.add(park)
        db.flush()

        uni_data = {**entry["uni"], "science_park_id": park.id}
        db.add(University(**uni_data))

    # Users
    for user_data in SEED_USERS:
        user = User(
            username=user_data["username"],
            password_hash=hash_password(user_data["password"]),
            role=user_data["role"],
            display_name=user_data["display_name"],
        )
        db.add(user)

    db.commit()
    print(f"Seeded {len(SEED_PARKS)} partnerships and {len(SEED_USERS)} users.")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(SciencePark).count() > 0:
            print("Database already seeded, skipping.")
        else:
            seed_db(db)
    finally:
        db.close()
