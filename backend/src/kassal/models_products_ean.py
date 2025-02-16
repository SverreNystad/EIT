from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from pydantic import BaseModel

from src.kassal.models_products import PriceHistory, Allergen, Nutrition, Store


class CurrentPriceDetail(BaseModel):
    price: float
    unit_price: Optional[float]
    date: datetime


class Kassalapp(BaseModel):
    url: str
    opengraph: Optional[Union[str, Dict[str, Any]]]


class EanProduct(BaseModel):
    id: int
    name: str
    vendor: Optional[str]
    brand: Optional[str]
    description: Optional[str]
    ingredients: Optional[str]
    url: str
    image: str
    store: Store
    current_price: CurrentPriceDetail
    weight: Optional[float]
    weight_unit: Optional[str]
    price_history: List[PriceHistory]
    kassalapp: Kassalapp
    created_at: datetime
    updated_at: datetime


class ProductsByEanData(BaseModel):
    ean: str
    products: List[EanProduct]
    allergens: List[Allergen]
    nutrition: List[Nutrition]


class ProductsByEanResponse(BaseModel):
    data: ProductsByEanData
