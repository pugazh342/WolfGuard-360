from app.database import SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = SessionLocal()
existing_admin = db.query(User).filter(User.username == "admin").first()

new_hashed_password = pwd_context.hash("wolfguard2026")

if not existing_admin:
    # Notice the new SaaS fields: role, last_ip, and location
    admin_user = User(
        username="admin", 
        hashed_password=new_hashed_password,
        role="admin",
        last_ip="127.0.0.1",
        location="Founder HQ" 
    )
    db.add(admin_user)
    print("SaaS Foundation: 'God Mode' Admin created successfully!")
else:
    existing_admin.hashed_password = new_hashed_password
    print("SaaS Foundation: Admin password reset to 'wolfguard2026'!")

db.commit()
db.close()