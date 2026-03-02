# CLAUDE.md – LSP Partnerdatenbank

## Projektübersicht

Webbasierte SQL-Datenbank für den **Lausitz Science Park (LSP)** zur Verwaltung von Partnerparks und assoziierten Universitäten. Auftrag der BTU Cottbus-Senftenberg.

**Features:**
- CRUD für Science Parks + verknüpfte Universitäten (kombinierte Tabellenansicht)
- 3 Zugriffslevel: Read-only, Read/Write, Read/Write/Delete (Admin)
- Filterbare, durchsuchbare Übersichtstabelle
- Detailansicht mit Zwei-Spalten-Layout
- Inline-Editing (Dropdown für Land, Kooperationsstatus)
- CSV/JSON Export (für spätere Datenübergabe an LSP GmbH / BTU)

**Kein KI-Feature.** Wurde vom Auftraggeber gestrichen.

**Deadline:** Flexible Zeitschiene, Gesamtprojekt läuft bis 12/2026.

**Portabilität:** System muss bei Projektende als Docker-Bundle + DB-Dump
übergeben werden können (BTU-Server oder LSP GmbH).

## Ausgangslage

- UI-Mockup existiert bereits (Figma Make Export → React/Vite/TypeScript)
- Mockup läuft mit hardcoded Mock-Daten in `App.tsx`
- Drei Screens: Übersicht (kombinierte Tabelle), Detailansicht, Berechtigungen
- shadcn/ui + Tailwind CSS v4 sind konfiguriert
- **Aufgabe:** Mock-Daten durch echtes Backend ersetzen, Auth einbauen

## Tech Stack

| Layer | Technologie | Begründung |
|-------|-------------|------------|
| Frontend | React 18 + Vite + TypeScript + Tailwind v4 + shadcn/ui | Besteht bereits |
| Backend | FastAPI (Python 3.11+) | Schnell, async, auto-generierte API-Docs |
| Datenbank | PostgreSQL 15+ | Zukunftssicher, native Array-Typen |
| ORM | SQLAlchemy 2.0 + Alembic | Migrations, typsicher |
| Auth | Session-basiert (httponly cookies) | Einfach, sicher für Intranet-Tool |
| Deployment | Docker Compose auf Hetzner VPS | Nginx Reverse Proxy, Let's Encrypt SSL |

---

## Coding Best Practices

### Allgemeine Regeln

- **Max. 500 Zeilen pro Datei.** Wird eine Datei länger → aufteilen.
- **Single Responsibility:** Jede Datei hat genau eine Aufgabe.
- **Keine God-Components:** React-Komponenten max. 200 Zeilen.
- **TypeScript strict mode:** Keine `any` Types. Interfaces für alle API-Responses.
- **Keine Magic Strings/Numbers:** Konstanten in eigene Dateien.
- **Deutsche UI-Texte, englischer Code.** Variablennamen, Kommentare, Commits englisch.

### Frontend-Struktur

```
frontend/src/
├── components/
│   ├── layout/              # Header, Navigation
│   │   ├── Navbar.tsx
│   │   └── PageLayout.tsx
│   ├── overview/            # Übersichts-Screen
│   │   ├── OverviewScreen.tsx
│   │   ├── PartnershipTable.tsx
│   │   ├── TableRow.tsx
│   │   ├── FilterBar.tsx
│   │   ├── SearchInput.tsx
│   │   └── KooperationDropdown.tsx
│   ├── detail/              # Detail-Screen
│   │   ├── DetailScreen.tsx
│   │   ├── ParkCard.tsx
│   │   ├── UniversityCard.tsx
│   │   └── EditForm.tsx
│   ├── permissions/
│   │   └── PermissionsScreen.tsx
│   ├── auth/
│   │   └── LoginScreen.tsx
│   └── ui/                  # shadcn/ui (bereits vorhanden)
├── api/
│   ├── client.ts            # Fetch-Wrapper mit Auth-Handling
│   ├── partnerships.ts      # Partnership API calls
│   ├── auth.ts              # Auth API calls
│   └── types.ts             # API Response Types
├── hooks/
│   ├── useAuth.ts
│   ├── usePartnerships.ts
│   └── useFilters.ts
├── lib/
│   ├── constants.ts         # Länder, Status-Werte, etc.
│   └── utils.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

**Regeln:**
- Props als eigenes Interface, nicht inline
- `api/` ist die einzige Stelle die `fetch()` aufruft
- Keine Business-Logik in Komponenten → Hooks oder Utils
- Loading/Error States in jeder Komponente mit API-Daten

### Backend-Struktur

```
backend/
├── app/
│   ├── main.py              # FastAPI App, CORS, Startup
│   ├── config.py            # pydantic-settings
│   ├── database.py          # Engine, SessionLocal, get_db
│   ├── models/
│   │   ├── __init__.py
│   │   ├── science_park.py
│   │   ├── university.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── partnership.py
│   │   ├── user.py
│   │   └── auth.py
│   ├── crud/
│   │   ├── __init__.py
│   │   ├── partnership.py
│   │   └── user.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── partnerships.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   └── export.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── dependencies.py
│   │   └── security.py
│   └── seed.py
├── alembic/
├── alembic.ini
├── requirements.txt
├── Dockerfile
└── tests/
```

**Regeln:**
- Router max. 500 Zeilen
- CRUD = reine DB-Ops, kein HTTP
- Router → CRUD → DB, keine Shortcuts
- Getrennte Schemas: Create, Update, Response
- SQLAlchemy ORM only, kein Raw SQL
- HTTPException mit deutschen Fehlermeldungen

---

## Datenbankschema

### `science_parks`

| Spalte | Typ | Constraint |
|--------|-----|-----------|
| id | SERIAL | PK |
| name | VARCHAR(255) | NOT NULL |
| land | VARCHAR(100) | NOT NULL |
| stadt | VARCHAR(100) | NOT NULL |
| gruendungsjahr | INTEGER | |
| bisherige_kooperation | VARCHAR(20) | CHECK IN ('Keine','Geplant','Aktiv','Abgeschlossen') |
| datum | DATE | |
| themen | TEXT[] | PostgreSQL Array |
| bemerkungen | TEXT | |
| ansprechpartner | VARCHAR(255) | |
| kontaktdetails | TEXT | |
| webpraesenz | VARCHAR(500) | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### `universitaeten`

**Reduzierter Umfang** – nur Profillinien/Forschungsschwerpunkte, keine Fakultäten.

| Spalte | Typ | Constraint |
|--------|-----|-----------|
| id | SERIAL | PK |
| science_park_id | INTEGER | FK → science_parks.id, UNIQUE |
| name | VARCHAR(255) | NOT NULL |
| standort | VARCHAR(255) | |
| forschungsschwerpunkte | TEXT[] | PostgreSQL Array |
| ansprechpartner | VARCHAR(255) | |
| website | VARCHAR(500) | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### `users`

| Spalte | Typ | Constraint |
|--------|-----|-----------|
| id | SERIAL | PK |
| username | VARCHAR(100) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | CHECK IN ('readonly','readwrite','admin') |
| display_name | VARCHAR(255) | |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## API Endpunkte

```
# Partnerships
GET    /api/partnerships              # Liste (?search=&land=&kooperation=)
GET    /api/partnerships/{id}         # Detail
POST   /api/partnerships              # Erstellen (readwrite+)
PUT    /api/partnerships/{id}         # Bearbeiten (readwrite+)
PATCH  /api/partnerships/{id}/status  # Kooperationsstatus (readwrite+)
DELETE /api/partnerships/{id}         # Löschen (admin)

# Auth
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

# Users (admin)
GET    /api/users
POST   /api/users
PUT    /api/users/{id}/role
DELETE /api/users/{id}

# Export (alle Rollen)
GET    /api/export/csv
GET    /api/export/json
```

---

## Rollenberechtigungen

| Aktion | readonly | readwrite | admin |
|--------|----------|-----------|-------|
| Ansehen + Export | ✅ | ✅ | ✅ |
| Erstellen + Bearbeiten | ❌ | ✅ | ✅ |
| Löschen | ❌ | ❌ | ✅ |
| Nutzer verwalten | ❌ | ❌ | ✅ |

---

## Deployment

Docker Compose auf Hetzner VPS. Domain: `lsp.ikigai-dynamics.com` o.ä.
SSL via Let's Encrypt. Backup: täglicher pg_dump cronjob.

**Übergabe bei Projektende 12/2026:**
- docker-compose.yml + alle Dockerfiles
- pg_dump der kompletten Datenbank
- Bedienungsanleitung
- .env.example mit allen nötigen Variablen

---

## Seed-Daten

5 Beispiel-Einträge aus App.tsx mockData.
3 Demo-User: admin/admin123, sandra/sandra123, gast/gast123.

---

## Hinweise für Claude Code

- Bestehende Komponenten refactoren, nicht neu schreiben
- Tailwind CSS v4 (nicht v3)
- shadcn/ui ist installiert, keine neuen UI-Libraries
- Alias-Pfade in vite.config.ts beibehalten (`@/` → `./src`)
- Datei >500 Zeilen → sofort aufteilen
- API camelCase, DB snake_case
- Fehler: Toast (sonner), nicht alert()
- Git Commits: englisch, konventionell (feat:, fix:, refactor:)