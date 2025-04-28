from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from src.sales_service import Sale


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
    # allow unknown extra fields (e.g. 'sale') without validation errors
    model_config = ConfigDict(extra="ignore")

    id: int
    name: str
    brand: Optional[str]
    vendor: Optional[str]
    ean: Optional[str]
    url: str
    image: str
    description: Optional[str]
    ingredients: Optional[str]
    current_price: Optional[float]
    current_unit_price: Optional[float]
    weight: Optional[float]
    weight_unit: Optional[str]
    store: Optional[Store]
    price_history: List[PriceHistory]
    allergens: List[Allergen]
    nutrition: List[Nutrition]
    created_at: datetime
    updated_at: datetime

    # new optional field for sale info
    sale: Optional[Sale] = Field(
        None,
        description="Optional sale information (price, percentage, or n-for-price)",
    )


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
