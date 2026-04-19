from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.report import Report
from models.user import User
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

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    total_reports = db.query(Report).count()
    pending_reports = db.query(Report).filter(Report.status == "pending").count()
    confirmed_reports = db.query(Report).filter(Report.status == "confirmed").count()
    resolved_reports = db.query(Report).filter(Report.status == "resolved").count()
    total_users = db.query(User).count()
    return {
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "confirmed_reports": confirmed_reports,
        "resolved_reports": resolved_reports,
        "total_users": total_users
    }

@router.get("/users")
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(User).all()
    return users

@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, role: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    return {"message": "User role updated successfully"}

@router.get("/reports/hotspots")
def get_hotspots(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    reports = db.query(Report).all()
    hotspots = {}
    for report in reports:
        area = report.location_name
        if area not in hotspots:
            hotspots[area] = 0
        hotspots[area] += 1
    return hotspots

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).filter(User.role == "resident").order_by(User.points.desc()).limit(10).all()
    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "location": u.location,
            "points": u.points
        }
        for u in users
    ]

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = db.query(Report).filter(Report.user_id == current_user.id).all()
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "location": current_user.location,
        "role": current_user.role,
        "points": current_user.points,
        "total_reports": len(reports),
        "resolved_reports": len([r for r in reports if r.status == "resolved"]),
        "pending_reports": len([r for r in reports if r.status == "pending"]),
    }

@router.put("/profile/update")
def update_profile(
    full_name: str,
    phone: str,
    location: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.full_name = full_name
    current_user.phone = phone
    current_user.location = location
    db.commit()
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role,
            "points": current_user.points,
            "location": current_user.location
        }
    }

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from models.report import Report
    from sqlalchemy import func
    import datetime

    reports = db.query(Report).all()

    status_counts = {
        "pending": len([r for r in reports if r.status == "pending"]),
        "confirmed": len([r for r in reports if r.status == "confirmed"]),
        "resolved": len([r for r in reports if r.status == "resolved"]),
    }

    location_counts = {}
    for report in reports:
        area = report.location_name
        if area not in location_counts:
            location_counts[area] = 0
        location_counts[area] += 1

    top_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)[:10]

    weekly_data = {}
    for report in reports:
        if report.created_at:
            week = report.created_at.strftime("%Y-W%U")
            if week not in weekly_data:
                weekly_data[week] = 0
            weekly_data[week] += 1

    illegal_count = len([r for r in reports if r.is_illegal_dumping])
    normal_count = len([r for r in reports if not r.is_illegal_dumping])

    total = len(reports)
    resolved = len([r for r in reports if r.status == "resolved"])
    resolution_rate = round((resolved / total * 100), 1) if total > 0 else 0

    return {
        "total_reports": total,
        "status_counts": status_counts,
        "top_locations": [{"location": k, "count": v} for k, v in top_locations],
        "weekly_data": [{"week": k, "count": v} for k, v in sorted(weekly_data.items())],
        "report_types": [
            {"name": "Normal Reports", "count": normal_count},
            {"name": "Illegal Dumping", "count": illegal_count}
        ],
        "resolution_rate": resolution_rate,
        "illegal_count": illegal_count,
        "normal_count": normal_count
    }

@router.get("/compliance")
def get_compliance(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from models.report import Report
    import datetime

    reports = db.query(Report).all()
    resolved = [r for r in reports if r.status == "resolved"]
    illegal = [r for r in reports if r.is_illegal_dumping]
    illegal_resolved = [r for r in reports if r.is_illegal_dumping and r.status == "resolved"]

    return {
        "generated_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "total_reports": len(reports),
        "resolved_reports": len(resolved),
        "pending_reports": len([r for r in reports if r.status == "pending"]),
        "confirmed_reports": len([r for r in reports if r.status == "confirmed"]),
        "illegal_dumping_total": len(illegal),
        "illegal_dumping_resolved": len(illegal_resolved),
        "resolution_rate": round((len(resolved) / len(reports) * 100), 1) if reports else 0,
        "illegal_resolution_rate": round((len(illegal_resolved) / len(illegal) * 100), 1) if illegal else 0,
        "resolved_list": [
            {
                "id": r.id,
                "location": r.location_name,
                "description": r.description,
                "type": "Illegal Dumping" if r.is_illegal_dumping else "Normal Waste",
                "date_reported": r.created_at.strftime("%Y-%m-%d") if r.created_at else "N/A",
            }
            for r in resolved
        ]
    }

@router.post("/contact")
def submit_contact(
    name: str,
    email: str,
    subject: str,
    message: str,
    db: Session = Depends(get_db)
):
    print(f"Contact form: {name} ({email}) - {subject}: {message}")
    return {"message": "Thank you for contacting us. We will get back to you soon."}