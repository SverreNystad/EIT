import json
from typing import List, Union
from pathlib import Path

from pydantic import BaseModel

from src.sales_service import ProductSales, SalesCatalog, SalesItem, Sale

DB_SALES_PATH = "data/sales_data.json"


def save_product_sales(
    product_sales: Union[ProductSales, List[ProductSales]],
    indent: int = 2,
) -> None:
    # Ensure directory exists
    file_path = Path(DB_SALES_PATH)
    file_path.parent.mkdir(parents=True, exist_ok=True)

    # Prepare raw JSON data
    if isinstance(product_sales, list):
        raw = [ps.model_dump_json() for ps in product_sales]
    else:
        raw = product_sales.model_dump_json()

    # Write to file
    with file_path.open("w", encoding="utf-8") as f:
        if isinstance(raw, list):
            # Join individual JSON strings into a JSON array
            data = [json.loads(item) for item in raw]
            json.dump(data, f, ensure_ascii=False, indent=indent)
        else:
            json.dump(json.loads(raw), f, ensure_ascii=False, indent=indent)


def load_product_sales() -> Union[ProductSales, List[ProductSales]]:

    file_path = Path(DB_SALES_PATH)
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    content = file_path.read_text(encoding="utf-8")
    parsed = json.loads(content)

    # Determine if it's a list or single object
    if isinstance(parsed, list):
        return [ProductSales.model_validate(item) for item in parsed]
    else:
        return ProductSales.model_validate(parsed)
