from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database

# This is the "router" variable that main.py is looking for
router = APIRouter(
    prefix="/assets",
    tags=["Assets"]
)

# 1. Create a new Target
@router.post("/", response_model=schemas.AssetResponse)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(database.get_db)):
    # Check if domain already exists
    existing_asset = db.query(models.Asset).filter(models.Asset.domain == asset.domain).first()
    if existing_asset:
        raise HTTPException(status_code=400, detail="Domain already tracked")
    
    # Create new asset
    new_asset = models.Asset(domain=asset.domain)
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    return new_asset

# 2. List all Targets
@router.get("/", response_model=list[schemas.AssetResponse])
def read_assets(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    assets = db.query(models.Asset).offset(skip).limit(limit).all()
    return assets