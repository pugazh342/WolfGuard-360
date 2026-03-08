from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, database

router = APIRouter(
    prefix="/admin",
    tags=["God Mode"]
)

@router.get("/users")
def get_system_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    user_data = []
    
    for user in users:
        user_data.append({
            "id": user.id,
            "username": user.username,
            "role": user.role.upper(),
            "last_ip": user.last_ip or "Not Tracked",
            "location": user.location or "Unknown",
            "active_targets": len(user.targets) # Counts how many apps they are protecting
        })
        
    return user_data