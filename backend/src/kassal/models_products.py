from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class PriceHistory(BaseModel):
    price: float
    date: datetime


class Allergen(BaseModel):
    code: str
    display_name: str
    contains: str


class Nutrition(BaseModel):
    code: str
    display_name: str
    amount: float
    unit: str


class Store(BaseModel):
    name: str
    code: str
    url: str
    logo: str


class Product(BaseModel):
    id: int
    name: str
    brand: Optional[str]
    vendor: Optional[str]
    ean: Optional[str]
    url: str
    image: str
    description: Optional[str]
    ingredients: Optional[str]
    current_price: float
    current_unit_price: Optional[float]
    weight: Optional[float]
    weight_unit: Optional[str]
    store: Store
    price_history: List[PriceHistory]
    allergens: List[Allergen]
    nutrition: List[Nutrition]
    created_at: datetime
    updated_at: datetime


class ProductsLinks(BaseModel):
    first: str
    last: Optional[str]
    prev: Optional[str]
    next: Optional[str]


class ProductsMeta(BaseModel):
    current_page: int
    from_: int = Field(..., alias="from")
    path: str
    per_page: int
    to: int


class ProductsResponse(BaseModel):
    data: List[Product]
    links: ProductsLinks
    meta: ProductsMeta


class SingleProductResponse(BaseModel):
    """
    If the single-product endpoint returns { "data": {...} },
    you can parse it into this wrapper, which itself holds a 'Product'.
    """

    data: Product
