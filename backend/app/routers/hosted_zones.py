from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate, HostedZoneResponse
from app.crud.hosted_zone import (
    get_hosted_zone,
    get_hosted_zone_by_name,
    get_hosted_zones,
    create_hosted_zone,
    update_hosted_zone,
    delete_hosted_zone
)
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=HostedZoneResponse, status_code=status.HTTP_201_CREATED)
def create_zone(
    zone_in: HostedZoneCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Check if a hosted zone with this name already exists
    existing_zone = get_hosted_zone_by_name(db, name=zone_in.name)
    if existing_zone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Hosted zone with name '{zone_in.name}' already exists."
        )
    return create_hosted_zone(db=db, hosted_zone=zone_in)

@router.get("/", response_model=List[HostedZoneResponse])
def list_zones(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return get_hosted_zones(db=db, skip=skip, limit=limit)

@router.get("/{hosted_zone_id}", response_model=HostedZoneResponse)
def get_zone(
    hosted_zone_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    zone = get_hosted_zone(db=db, hosted_zone_id=hosted_zone_id)
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found."
        )
    return zone

@router.put("/{hosted_zone_id}", response_model=HostedZoneResponse)
def update_zone(
    hosted_zone_id: int,
    zone_in: HostedZoneUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    zone = update_hosted_zone(db=db, hosted_zone_id=hosted_zone_id, hosted_zone_update=zone_in)
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found."
        )
    return zone

@router.delete("/{hosted_zone_id}", status_code=status.HTTP_200_OK)
def delete_zone(
    hosted_zone_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    zone = delete_hosted_zone(db=db, hosted_zone_id=hosted_zone_id)
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hosted zone not found."
        )
    return {"message": "Hosted zone deleted successfully", "id": hosted_zone_id}
