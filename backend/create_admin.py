import sys
sys.path.append('.')

from database import SessionLocal, engine, Base
from models.user import User
from models import user
import bcrypt

Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing = db.query(User).filter(User.email == "admin@taka.com").first()
if existing:
    print("Admin already exists!")
else:
    hashed = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin = User(
        full_name="Admin User",
        email="admin@taka.com",
        hashed_password=hashed,
        phone="0700000000",
        location="Nairobi County",
        role="admin"
    )
    db.add(admin)
    db.commit()
    print("Admin created successfully!")

db.close()