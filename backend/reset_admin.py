import sys
sys.path.append('.')
from database import SessionLocal
from models.user import User
import bcrypt

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@taka.com").first()
if user:
    hashed = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user.hashed_password = hashed
    user.role = "admin"
    db.commit()
    print("Admin password reset successfully!")
else:
    print("Admin not found!")
db.close()