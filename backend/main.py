from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app import models, database, auth
from app.routers import assets, scans, waf, auth as auth_router, targets, admin # <-- Imported admin

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="WolfGuard 360 SECaaS API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(auth_router.router)
app.include_router(assets.router)
app.include_router(scans.router)
app.include_router(waf.router)
app.include_router(targets.router)
app.include_router(admin.router) # <-- Registered admin router

@app.on_event("startup")
def create_default_admin():
    db = database.SessionLocal()
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin_user:
        new_admin = models.User(
            username="admin",
            hashed_password=auth.get_password_hash("wolfguard2026"),
            role="admin",
            last_ip="127.0.0.1",
            location="Founder HQ"
        )
        db.add(new_admin)
        db.commit()
    db.close()

@app.get("/")
def read_root():
    return {"message": "WolfGuard 360 SECaaS Cloud is Running!", "status": "secure"}

@app.get("/health")
def health_check(db: Session = Depends(database.get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}