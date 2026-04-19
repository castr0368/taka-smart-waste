from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company
from models.user import User
from models.report import Report
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
def get_companies(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Company).all()

@router.post("/")
def create_company(
    name: str, email: str, phone: str,
    coverage_areas: str, license_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    company = Company(
        name=name, email=email, phone=phone,
        coverage_areas=coverage_areas,
        license_number=license_number
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return {"message": "Company added successfully", "company_id": company.id}

@router.delete("/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(company)
    db.commit()
    return {"message": "Company removed successfully"}

@router.get("/{company_id}/reports")
def get_company_reports(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    coverage_areas = [area.strip().lower() for area in company.coverage_areas.split(",")]
    all_reports = db.query(Report).all()
    matching_reports = [
        r for r in all_reports
        if any(area in r.location_name.lower() for area in coverage_areas)
    ]
    return {
        "company": company.name,
        "coverage_areas": company.coverage_areas,
        "total_reports_in_area": len(matching_reports),
        "pending": len([r for r in matching_reports if r.status == "pending"]),
        "confirmed": len([r for r in matching_reports if r.status == "confirmed"]),
        "resolved": len([r for r in matching_reports if r.status == "resolved"]),
        "reports": [
            {
                "id": r.id,
                "location": r.location_name,
                "description": r.description,
                "status": r.status,
                "is_illegal_dumping": r.is_illegal_dumping,
                "created_at": str(r.created_at)
            }
            for r in matching_reports
        ]
    }