from typing import Optional, List
from pydantic import BaseModel, Field


class Position(BaseModel):
    lat: float
    lng: float


class OpeningHours(BaseModel):
    monday: Optional[str]
    tuesday: Optional[str]
    wednesday: Optional[str]
    thursday: Optional[str]
    friday: Optional[str]
    saturday: Optional[str]
    sunday: Optional[str]


class PhysicalStore(BaseModel):
    id: int
    group: str
    name: str
    address: str
    phone: str
    email: str
    fax: str
    logo: str
    website: str
    detailUrl: str
    position: Position
    openingHours: OpeningHours


class Links(BaseModel):
    first: str
    last: str
    prev: Optional[str]
    next: Optional[str]


class MetaLink(BaseModel):
    url: Optional[str]
    label: str
    active: bool


class Meta(BaseModel):
    current_page: int
    from_: int = Field(..., alias="from")
    last_page: int
    links: List[MetaLink]
    path: str
    per_page: int
    to: int
    total: int


class PhysicalStoresResponse(BaseModel):
    data: List[PhysicalStore]
    links: Links
    meta: Meta


class SinglePhysicalStoreResponse(BaseModel):
    data: PhysicalStore
