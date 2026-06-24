from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Record(Base):
    __tablename__ = "records"
    
    id = Column(Integer, primary_key=True, index=True)
    hosted_zone_id = Column(Integer, ForeignKey("hosted_zones.id"))
    name = Column(String)
    type = Column(String)  # A, CNAME, MX etc.
    value = Column(String)
    ttl = Column(Integer, default=300)
    
    hosted_zone = relationship("HostedZone", back_populates="records")