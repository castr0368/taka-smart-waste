from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.schedule import Schedule
from models.user import User
from models.notification import Notification
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/")
def get_schedules(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    schedules = db.query(Schedule).all()
    return schedules

@router.post("/")
def create_schedule(
    zone: str,
    area_name: str,
    collection_date: str,
    collection_time: str,
    waste_type: str,
    collector_company: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    from datetime import datetime
    schedule = Schedule(
        zone=zone,
        area_name=area_name,
        collection_date=datetime.strptime(collection_date, "%Y-%m-%d"),
        collection_time=collection_time,
        waste_type=waste_type,
        collector_company=collector_company
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    users = db.query(User).filter(User.role == "resident").all()
    for user in users:
        notification = Notification(
            user_id=user.id,
            title="New Collection Schedule",
            message=f"A new waste collection has been scheduled for {area_name} on {collection_date} at {collection_time}. Collector: {collector_company}."
        )
        db.add(notification)
    db.commit()

    return {"message": "Schedule created successfully", "schedule_id": schedule.id}

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted successfully"}