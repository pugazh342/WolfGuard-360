from fastapi import APIRouter, Depends, HTTPException, Header, BackgroundTasks
from sqlalchemy.orm import Session
from app import models, database, schemas
import httpx

router = APIRouter(
    prefix="/waf",
    tags=["WAF Telemetry"]
)

# --- NEW: Python Discord Alert Engine ---
def send_discord_alert(webhook_url: str, ip: str, blocked_url: str, payload: str, app_name: str):
    if not webhook_url:
        return
    
    embed = {
        "username": "WolfGuard SOC (SaaS Cloud)",
        "avatar_url": "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
        "embeds": [{
            "title": f"🚨 Threat Intercepted: {app_name}",
            "description": "A remote WolfGuard agent just blocked a malicious request.",
            "color": 16711680,
            "fields": [
                {"name": "Attacker IP", "value": ip, "inline": True},
                {"name": "Rule Triggered", "value": payload, "inline": True},
                {"name": "Target URL", "value": blocked_url, "inline": False},
            ],
            "footer": {"text": "WolfGuard-360 SECaaS Platform"}
        }]
    }
    try:
        httpx.post(webhook_url, json=embed)
    except Exception as e:
        print(f"Failed to send Discord alert: {e}")

@router.post("/logs")
def receive_waf_log(
    log_data: schemas.WafLogCreate, 
    background_tasks: BackgroundTasks,
    x_api_key: str = Header(...), # 🔒 Demands the golden key!
    db: Session = Depends(database.get_db)
):
    # 1. Authenticate the WAF Agent
    target = db.query(models.Target).filter(models.Target.api_key == x_api_key).first()
    if not target or not target.is_active:
        raise HTTPException(status_code=401, detail="Invalid or inactive API Key")

    # 2. Save the log linked to this specific customer's app
    new_log = models.WafLog(
        target_id=target.id,
        attacker_ip=log_data.attacker_ip,
        blocked_url=log_data.blocked_url,
        payload_detected=log_data.payload_detected
    )
    db.add(new_log)
    db.commit()

    # 3. Fire the Discord Alert in the background!
    if target.discord_webhook:
        background_tasks.add_task(
            send_discord_alert, 
            target.discord_webhook, 
            log_data.attacker_ip, 
            log_data.blocked_url, 
            log_data.payload_detected,
            target.app_name
        )

    return {"status": "Logged successfully"}

@router.get("/logs")
def get_logs(db: Session = Depends(database.get_db)):
    # Grabs all logs (Later we will filter this by logged-in user)
    logs = db.query(models.WafLog).order_by(models.WafLog.timestamp.desc()).all()
    return logs