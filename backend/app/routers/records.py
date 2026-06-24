from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.record import RecordCreate, RecordUpdate, RecordResponse
from app.crud.record import (
    get_record,
    get_records_by_hosted_zone,
    create_record,
    update_record,
    delete_record
)
from app.crud.hosted_zone import get_hosted_zone
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/hosted-zones/{hosted_zone_id}/records", response_model=RecordResponse, status_code=status.HTTP_201_CREATED)
def create_zone_record(
    hosted_zone_id: int,
    record_in: RecordCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Ensure the hosted zone exists
    zone = get_hosted_zone(db=db, hosted_zone_id=hosted_zone_id)
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found."
        )
    
    # Overwrite hosted_zone_id in record_in to match path parameter if mismatch
    record_in.hosted_zone_id = hosted_zone_id
    
    return create_record(db=db, record=record_in)

@router.get("/hosted-zones/{hosted_zone_id}/records", response_model=List[RecordResponse])
def list_zone_records(
    hosted_zone_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Ensure the hosted zone exists
    zone = get_hosted_zone(db=db, hosted_zone_id=hosted_zone_id)
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found."
        )
        
    return get_records_by_hosted_zone(db=db, hosted_zone_id=hosted_zone_id, skip=skip, limit=limit)

@router.get("/records/{record_id}", response_model=RecordResponse)
def get_single_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    record = get_record(db=db, record_id=record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found."
        )
    return record

@router.put("/records/{record_id}", response_model=RecordResponse)
def update_single_record(
    record_id: int,
    record_in: RecordUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    record = update_record(db=db, record_id=record_id, record_update=record_in)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found."
        )
    return record

@router.delete("/records/{record_id}", status_code=status.HTTP_200_OK)
def delete_single_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    record = delete_record(db=db, record_id=record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found."
        )
    return {"message": "Record deleted successfully", "id": record_id}
