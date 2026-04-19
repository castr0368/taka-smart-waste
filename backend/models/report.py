from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    description = Column(String)
    location_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    photo_url = Column(String, nullable=True)
    status = Column(String, default="pending")
    report_type = Column(String, default="uncollected")
    is_illegal_dumping = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)