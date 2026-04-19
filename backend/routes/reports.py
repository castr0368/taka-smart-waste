from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models.report import Report
from models.user import User
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os, shutil, uuid

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

def upload_photo(photo_file, contents):
    try:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET")
        )

        if not os.getenv("CLOUDINARY_CLOUD_NAME"):
            raise Exception("Cloudinary not configured")

        upload_result = cloudinary.uploader.upload(
            contents,
            folder="taka-waste-reports",
            resource_type="image"
        )
        return upload_result["secure_url"]
    except Exception as e:
        print(f"Cloudinary upload failed, using local storage: {e}")
        ext = photo_file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = f"uploads/{filename}"
        with open(filepath, "wb") as buffer:
            buffer.write(contents)
        return f"/uploads/{filename}"

@router.post("/")
async def create_report(
    description: str = Form(...),
    location_name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    report_type: str = Form(default="uncollected"),
    is_illegal_dumping: bool = Form(default=False),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    photo_url = None
    if photo:
        contents = await photo.read()
        photo_url = upload_photo(photo, contents)

    report = Report(
        user_id=current_user.id,
        description=description,
        location_name=location_name,
        latitude=latitude,
        longitude=longitude,
        photo_url=photo_url,
        report_type=report_type,
        is_illegal_dumping=is_illegal_dumping
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"message": "Report submitted successfully", "report_id": report.id}

@router.get("/")
def get_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "admin":
        reports = db.query(Report).all()
    else:
        reports = db.query(Report).filter(Report.user_id == current_user.id).all()
    return reports

@router.put("/{report_id}/status")
def update_status(report_id: int, status: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = status
    user = db.query(User).filter(User.id == report.user_id).first()
    if status == "confirmed":
        if user:
            from models.notification import Notification
            notification = Notification(
                user_id=report.user_id,
                title="Report Confirmed",
                message=f"Your waste report at {report.location_name} has been confirmed by the county. Our team is on the way."
            )
            db.add(notification)
    if status == "resolved":
        if user:
            user.points += 10
            from models.notification import Notification
            notification = Notification(
                user_id=report.user_id,
                title="Report Resolved & Points Awarded!",
                message=f"Your report at {report.location_name} has been resolved. You have been awarded 10 points. Thank you!"
            )
            db.add(notification)
    db.commit()
    return {"message": "Status updated successfully"}