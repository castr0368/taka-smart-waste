from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    zone = Column(String)
    area_name = Column(String)
    collection_date = Column(DateTime)
    collection_time = Column(String)
    waste_type = Column(String)
    collector_company = Column(String)
    status = Column(String, default="scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())