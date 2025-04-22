from pathlib import Path
from typing import Literal, Optional, List
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

import base64
from io import BytesIO
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

from PIL import Image

from src.configuration import OPENAI_API_KEY


class Sale(BaseModel):
    type: Literal["price", "percentage", "n_for_price"] = Field(
        ..., description="Type of sale"
    )
    price: Optional[float] = Field(
        None, description="If type=='price', this is the sale price"
    )
    discount_percentage: Optional[float] = Field(
        None, description="If type=='percentage', percent off (e.g. 20 for 20%)"
    )
    n: Optional[int] = Field(None, description="If type=='n_for_price', how many items")
    total_price: Optional[float] = Field(
        None, description="If type=='n_for_price', total for n items"
    )


class SalesItem(BaseModel):
    name: str = Field(..., description="Product name")
    sale: Sale


class SalesCatalog(BaseModel):
    products: List[SalesItem]


class ProductSales(BaseModel):
    """
    Represents a collection of products with their respective sales.
    """

    products: SalesCatalog
    vendor: Optional[str] = Field(None, description="Vendor of the products")


def convert_to_base64(pil_image):
    """
    Convert PIL images to Base64 encoded strings

    :param pil_image: PIL image
    :return: Re-sized Base64 string
    """

    buffered = BytesIO()
    pil_image.save(buffered, format="JPEG")  # You can change the format if needed
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str


def _extract_sales_from_images(
    images_paths: List[str], shop_name: list[str]
) -> List[ProductSales]:
    """
    Extracts sales from a list of images.
    This is a placeholder function and should be implemented with actual logic.
    """
    # Placeholder implementation
    products_on_sale = []
    for images_path in images_paths:

        model = ChatOpenAI(
            model="gpt-4o-2024-08-06",
            api_key=OPENAI_API_KEY,
        )
        model_with_structure = model.with_structured_output(SalesCatalog)
        pil_image = Image.open(images_path)
        image_data = convert_to_base64(pil_image)

        message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": "This is an image of a page from a promotional catalog containing multiple grocery products. For each product shown in the image, please extract: The product name and The price corresponding to that product",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_data}"},
                },
            ],
        )
        response: SalesCatalog = model_with_structure.invoke([message])
        products_on_sale.append(response)

    # Add vendor information to products and create ProductSales objects
    product_sales_list = []
    for products in products_on_sale:
        product_sales = ProductSales(products=products, vendor=shop_name)
        product_sales_list.append(product_sales)
    return product_sales_list


ROOT_DIR = Path(__file__).resolve().parents[2]
# Default path to downloaded images
DEFAULT_IMAGES_ROOT = ROOT_DIR / "data" / "downloaded_images"


def get_all_sales_from_vendor(
    vendor: str,
    images_root: Path = DEFAULT_IMAGES_ROOT,
) -> List[ProductSales]:
    """
    Locate all images for a vendor and extract sales data.

    Args:
        vendor: folder name under downloaded_images
        images_root: base directory for downloaded images

    Returns:
        List of ProductSales objects
    """
    vendor_dir = images_root / vendor
    print(f"Vendor directory: {vendor_dir}")

    if not vendor_dir.exists() or not vendor_dir.is_dir():
        print(f"Vendor directory does not exist: {vendor_dir.is_dir()}")
        print(f"Creating vendor directory: {vendor_dir.exists()}")
        raise FileNotFoundError(f"Vendor directory not found: {vendor_dir}")

    # Gather all valid image files
    # for p in vendor_dir.iterdir():

    image_files = [
        str(p)
        for p in vendor_dir.iterdir()
        if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png")
    ]
    print(f"Image files found: {image_files}")
    if not image_files:
        raise FileNotFoundError(f"No images found in {vendor_dir}")

    return _extract_sales_from_images(image_files, vendor)
