from sqlalchemy.orm import Session
from app.models.record import Record
from app.schemas.record import RecordCreate, RecordUpdate

def get_record(db: Session, record_id: int):
    return db.query(Record).filter(Record.id == record_id).first()

def get_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Record).offset(skip).limit(limit).all()

def get_records_by_hosted_zone(db: Session, hosted_zone_id: int, skip: int = 0, limit: int = 100):
    return db.query(Record).filter(Record.hosted_zone_id == hosted_zone_id).offset(skip).limit(limit).all()

def create_record(db: Session, record: RecordCreate):
    db_record = Record(
        hosted_zone_id=record.hosted_zone_id,
        name=record.name,
        type=record.type,
        value=record.value,
        ttl=record.ttl
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def update_record(db: Session, record_id: int, record_update: RecordUpdate):
    db_record = get_record(db, record_id)
    if not db_record:
        return None
    
    update_data = record_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_record, key, value)
        
    db.commit()
    db.refresh(db_record)
    return db_record

def delete_record(db: Session, record_id: int):
    db_record = get_record(db, record_id)
    if not db_record:
        return None
    db.delete(db_record)
    db.commit()
    return db_record
