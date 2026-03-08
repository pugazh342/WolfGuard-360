from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, database, auth
import httpx

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_geo_location(ip: str):
    try:
        # 1. Developer Fallback (Get Public IP)
        if ip in ["127.0.0.1", "localhost", "0.0.0.0"] or ip.startswith("172.") or ip.startswith("192.168."):
            ip_resp = httpx.get("https://api64.ipify.org?format=json", timeout=5.0)
            ip = ip_resp.json().get("ip", ip)

        # 2. Gold Standard API (ipinfo.io) - highly reliable for regional ISPs
        try:
            geo_resp = httpx.get(f"https://ipinfo.io/{ip}/json", timeout=5.0)
            data = geo_resp.json()
            
            # Be permissive: Grab whatever data they have available
            city = data.get("city")
            region = data.get("region")
            country = data.get("country")
            
            # Build the best possible location string
            if city and country:
                return ip, f"{city}, {country}"
            elif region and country:
                return ip, f"{region}, {country}"
            elif country:
                return ip, country
                
        except Exception as e:
            print(f"ipinfo API Failed: {e}")
            pass 

        return ip, "Location Data Unavailable"
        
    except Exception as e:
        print(f"Total Geo-IP Failure: {e}")
        return ip, "Unknown (Offline)"


@router.post("/login")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(database.get_db)
):
    # 1. Look up the user in the CORRECT database table (User, not Admin)
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    
    # 2. Check if the user exists and the password matches the hash
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # --- Geo-IP Tracking Injection ---
    raw_ip = request.client.host
    real_ip, location = get_geo_location(raw_ip)
    
    # Save the updated intel directly to the Vault
    user.last_ip = real_ip
    user.location = location
    db.commit()
    # --------------------------------------
    
    # 3. If everything is correct, create and return the JWT wristband!
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}