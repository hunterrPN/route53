from sqlalchemy.orm import Session
from app.models.hosted_zone import HostedZone
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate
import uuid

def get_hosted_zone(db: Session, hosted_zone_id: int):
    return db.query(HostedZone).filter(HostedZone.id == hosted_zone_id).first()

def get_hosted_zone_by_name(db: Session, name: str):
    return db.query(HostedZone).filter(HostedZone.name == name).first()

def get_hosted_zones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(HostedZone).offset(skip).limit(limit).all()

def create_hosted_zone(db: Session, hosted_zone: HostedZoneCreate):
    caller_ref = hosted_zone.caller_reference or str(uuid.uuid4())
    db_hosted_zone = HostedZone(
        name=hosted_zone.name,
        comment=hosted_zone.comment,
        caller_reference=caller_ref
    )
    db.add(db_hosted_zone)
    db.commit()
    db.refresh(db_hosted_zone)
    return db_hosted_zone

def update_hosted_zone(db: Session, hosted_zone_id: int, hosted_zone_update: HostedZoneUpdate):
    db_hosted_zone = get_hosted_zone(db, hosted_zone_id)
    if not db_hosted_zone:
        return None
    
    if hosted_zone_update.comment is not None:
        db_hosted_zone.comment = hosted_zone_update.comment
        
    db.commit()
    db.refresh(db_hosted_zone)
    return db_hosted_zone

def delete_hosted_zone(db: Session, hosted_zone_id: int):
    db_hosted_zone = get_hosted_zone(db, hosted_zone_id)
    if not db_hosted_zone:
        return None
    db.delete(db_hosted_zone)
    db.commit()
    return db_hosted_zone
