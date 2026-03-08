from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app import database, models
from app.services import scanner  # Import the file we just made

router = APIRouter(
    prefix="/scans",
    tags=["Scans"]
)

@router.post("/{asset_id}")
def trigger_scan(asset_id: int, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    # 1. Check if asset exists
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # 2. Run the scan in the background (so the UI doesn't freeze)
    background_tasks.add_task(scanner.perform_scan, asset_id, db)

    return {"message": f"Scan started for {asset.domain}", "status": "processing"}