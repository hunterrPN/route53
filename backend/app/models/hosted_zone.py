from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class HostedZone(Base):
    __tablename__ = "hosted_zones"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    comment = Column(String, nullable=True)
    caller_reference = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    records = relationship("Record", back_populates="hosted_zone", cascade="all, delete-orphan")