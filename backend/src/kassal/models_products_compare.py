from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel

from src.kassal.models_products_ean import CurrentPriceDetail
from src.kassal.models_products import PriceHistory, Allergen, Nutrition, Store


class Kassalapp(BaseModel):
    url: str
    opengraph: Optional[Any]


class ProductCompare(BaseModel):
    id: int
    name: str
    vendor: Optional[str]
    brand: Optional[str]
    description: Optional[str]
    ingredients: Optional[str]
    url: str
    image: str
    store: Optional[Store]
    current_price: Optional[CurrentPriceDetail]
    weight: Optional[int]
    weight_unit: Optional[str]
    price_history: List[PriceHistory]
    kassalapp: Kassalapp
    created_at: datetime
    updated_at: datetime


class ProductsCompareData(BaseModel):
    ean: str
    products: List[ProductCompare]
    allergens: List[Allergen]
    nutrition: List[Nutrition]


class ProductsCompareResponse(BaseModel):
    data: ProductsCompareData
