import sys
sys.path.append('.')
from database import SessionLocal, engine, Base
from models.user import User
from models.report import Report
from models.schedule import Schedule
from models.company import Company
from models.notification import Notification

print("\n" + "="*50)
print("  TAKA DATABASE CLEANUP")
print("="*50)

db = SessionLocal()

notifications_deleted = db.query(Notification).delete()
print(f"✅ Deleted {notifications_deleted} notifications")

reports_deleted = db.query(Report).delete()
print(f"✅ Deleted {reports_deleted} reports")

schedules_deleted = db.query(Schedule).delete()
print(f"✅ Deleted {schedules_deleted} schedules")

companies_deleted = db.query(Company).delete()
print(f"✅ Deleted {companies_deleted} companies")

users_deleted = db.query(User).delete()
print(f"✅ Deleted {users_deleted} users")

db.commit()
db.close()

print("\n✅ Database cleaned successfully!")
print("Run create_admin.py to recreate the admin account")
print("="*50 + "\n")