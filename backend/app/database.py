from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# 1. Get the Database URL from the environment variable (set in docker-compose.yml)
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Create the Database Engine
engine = create_engine(DATABASE_URL)

# 3. Create a SessionLocal class
# Each request will create a new session instance
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create the Base class
# All our database models will inherit from this class
Base = declarative_base()

# 5. Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()