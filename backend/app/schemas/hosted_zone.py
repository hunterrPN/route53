from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HostedZoneBase(BaseModel):
    name: str
    comment: Optional[str] = None

class HostedZoneCreate(HostedZoneBase):
    caller_reference: Optional[str] = None

class HostedZoneUpdate(BaseModel):
    comment: Optional[str] = None

class HostedZoneResponse(HostedZoneBase):
    id: int
    caller_reference: str
    created_at: datetime

    class Config:
        from_attributes = True
