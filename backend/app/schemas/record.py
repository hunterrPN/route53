from pydantic import BaseModel, Field
from typing import Optional, Literal

RecordType = Literal["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"]

class RecordBase(BaseModel):
    name: str
    type: RecordType
    value: str
    ttl: Optional[int] = Field(default=300, ge=0)

class RecordCreate(RecordBase):
    hosted_zone_id: int

class RecordUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[RecordType] = None
    value: Optional[str] = None
    ttl: Optional[int] = Field(default=None, ge=0)

class RecordResponse(RecordBase):
    id: int
    hosted_zone_id: int

    class Config:
        from_attributes = True
