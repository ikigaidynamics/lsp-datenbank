from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, export, partnerships, users

app = FastAPI(
    title="LSP Partnerdatenbank",
    description="API für den Lausitz Science Park – Partnerdatenbank",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(partnerships.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(export.router)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
