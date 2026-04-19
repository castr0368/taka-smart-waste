from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from models import user, report, schedule
from routes import auth, reports, schedules, admin, companies, notifications, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Taka Smart Waste API")

app.add_middleware(
    CORSMiddleware,
   allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(schedules.router, prefix="/api/schedules", tags=["schedules"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def root():
    return {"message": "Taka Smart Waste API is running"}