from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

# --- 1. The Users Table (Tracks Customers & Admins) ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="customer")
    last_ip = Column(String, nullable=True)
    location = Column(String, nullable=True)
    last_active = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    targets = relationship("Target", back_populates="owner")

# --- 2. The Targets Table (The Apps Being Protected) ---
class Target(Base):
    __tablename__ = "targets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    app_name = Column(String, nullable=False)
    target_url = Column(String, nullable=False)
    api_key = Column(String, unique=True, index=True, nullable=False)
    discord_webhook = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner = relationship("User", back_populates="targets")
    logs = relationship("WafLog", back_populates="target")

# --- 3. The Multi-Tenant WAF Log Table ---
class WafLog(Base):
    __tablename__ = "waf_logs"
    id = Column(Integer, primary_key=True, index=True)
    target_id = Column(Integer, ForeignKey("targets.id"))
    attacker_ip = Column(String, nullable=False)
    blocked_url = Column(String, nullable=False)
    payload_detected = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    target = relationship("Target", back_populates="logs")

# --- 4. The Asset Table (Restored for your Dashboard!) ---
class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, unique=True, index=True, nullable=False)
    ip_address = Column(String, nullable=True)
    ports = Column(JSON, default=[])
    vulnerabilities = Column(JSON, default=[])
    subdomains = Column(JSON, default=[])
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_scanned = Column(DateTime(timezone=True), nullable=True)