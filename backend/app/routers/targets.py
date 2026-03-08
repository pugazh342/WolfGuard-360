from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database
from pydantic import BaseModel
from typing import Optional, List
import secrets

router = APIRouter(
    prefix="/targets",
    tags=["SaaS Targets"]
)

# Pydantic schema for creating a target
class TargetCreate(BaseModel):
    app_name: str
    target_url: str
    discord_webhook: Optional[str] = None

@router.post("/register")
def register_target(target: TargetCreate, db: Session = Depends(database.get_db)):
    # 1. Generate a cryptographically secure 32-character API Key
    generated_api_key = "wg_" + secrets.token_hex(16)

    # 2. Hardcoded to user_id 1 (Admin) for now
    new_target = models.Target(
        user_id=1,
        app_name=target.app_name,
        target_url=target.target_url,
        api_key=generated_api_key,
        discord_webhook=target.discord_webhook
    )

    db.add(new_target)
    db.commit()
    db.refresh(new_target)

    return {
        "message": "Target Registered Successfully",
        "app_name": new_target.app_name,
        "api_key": new_target.api_key,
        "discord_webhook": new_target.discord_webhook
    }

@router.get("/list")
def list_targets(db: Session = Depends(database.get_db)):
    # Returns all targets currently in the vault
    targets = db.query(models.Target).all()
    return targets

@router.delete("/{target_id}")
def revoke_target(target_id: int, db: Session = Depends(database.get_db)):
    target = db.query(models.Target).filter(models.Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    
    # Remove the target and all its associated logs (Cascade)
    db.delete(target)
    db.commit()
    
    return {"message": f"Target {target_id} revoked successfully. API Key is now dead."}