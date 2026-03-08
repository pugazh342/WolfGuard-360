from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# --- Target (Protected App) Schemas ---
class TargetBase(BaseModel):
    app_name: str
    target_url: str
    discord_webhook: Optional[str] = None

class TargetCreate(TargetBase):
    pass

class TargetResponse(TargetBase):
    id: int
    api_key: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- WAF Log Schemas ---
class WafLogCreate(BaseModel):
    attacker_ip: str
    blocked_url: str
    payload_detected: str

class WafLogResponse(WafLogCreate):
    id: int
    target_id: int
    timestamp: datetime
    class Config:
        from_attributes = True

# --- User (Customer/Admin) Schemas ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    last_ip: Optional[str] = None
    location: Optional[str] = None
    last_active: Optional[datetime] = None
    targets: List[TargetResponse] = []
    class Config:
        from_attributes = True

# --- Asset Schemas (Restored!) ---
class AssetBase(BaseModel):
    domain: str

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    ip_address: Optional[str] = None
    ports: List[Any] = []
    vulnerabilities: List[Any] = []
    subdomains: List[Any] = []
    is_active: bool
    created_at: datetime
    last_scanned: Optional[datetime] = None
    class Config:
        from_attributes = True