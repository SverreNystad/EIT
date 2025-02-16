from pydantic import BaseModel
from src.kassal.models_products import Product


class FindByUrlResponse(BaseModel):
    data: Product
