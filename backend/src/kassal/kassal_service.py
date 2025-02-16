from typing import Optional, Union, Any, Dict
import requests
from pydantic import ValidationError

from src.kassal.models_physical_stores import (
    PhysicalStoresResponse,
    PhysicalStore,
    SinglePhysicalStoreResponse,
)
from src.kassal.models_products import (
    ProductsResponse,
    Product,
    SingleProductResponse,
)
from src.kassal.models_find_by_url_single import (
    FindByUrlResponse,
)  # returns { data: Product }
from src.kassal.models_products_ean import ProductsByEanResponse, ProductsByEanData
from src.kassal.models_products_compare import (
    ProductsCompareResponse,
    ProductsCompareData,
)


class KassalAPI:
    """
    A simple wrapper around the Kassal API.
    The API is rate limited to 60 requests per minute. If you exceed this, you'll get a 429 response.
    One can remove the rate limit check if one pays.

    Full API documentation: https://kassal.app/api/
    """

    BASE_URL: str = "https://kassal.app/api/v1/"

    GROUPS = [
        "ALLTIMAT",
        "BUNNPRIS",
        "COOP_BYGGMIX",
        "COOP_ELEKTRO",
        "COOP_EXTRA",
        "COOP_MARKED",
        "COOP_MEGA",
        "COOP_OBS",
        "COOP_OBS_BYGG",
        "COOP_PRIX",
        "EUROPRIS_NO",
        "FUDI",
        "GIGABOKS",
        "HAVARISTEN",
        "JOKER_NO",
        "KIWI",
        "MATKROKEN",
        "MENY_NO",
        "NAERBUTIKKEN",
        "REMA_1000",
        "SPAR_NO",
    ]

    def __init__(self, token: str) -> None:
        self.token: str = token
        self.headers: Dict[str, str] = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/json",
        }

    def _get(
        self, endpoint: str, params: Optional[Dict[str, Union[str, int, float]]] = None
    ) -> Dict[str, Any]:
        """
        Helper method for GET requests.
        Raises an exception if the rate limit is exceeded or the response contains an error.
        Returns the JSON payload as a dict.
        """
        url: str = self.BASE_URL + endpoint
        response = requests.get(url, headers=self.headers, params=params)

        # Check for rate limit
        if response.status_code == 429:
            raise Exception(
                "Rate limit exceeded. You can only call the API 60 times per minute."
            )

        response.raise_for_status()
        return response.json()

    # ----------------------------
    # Physical Stores
    # ----------------------------
    def get_physical_stores(
        self,
        search: Optional[str] = None,
        page: int = 1,
        size: int = 10,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
        km: float = 5,
        group: Optional[str] = None,
    ) -> PhysicalStoresResponse:
        """
        GET /physical-stores
        Returns a PhysicalStoresResponse Pydantic model.
        """
        if (lat is None) != (lng is None):
            raise ValueError(
                "Both latitude and longitude must be set together or omitted."
            )
        if km < 0:
            raise ValueError("The radius (km) must be non-negative.")
        if group and group not in self.GROUPS:
            raise ValueError(f"Invalid group. Must be one of: {self.GROUPS}")

        params: Dict[str, Union[str, int, float]] = {}
        if search:
            params["search"] = search
        params["page"] = page
        params["size"] = size
        if lat is not None and lng is not None:
            params["lat"] = lat
            params["lng"] = lng
            params["km"] = km
        if group:
            params["group"] = group

        raw_json = self._get("physical-stores", params=params)
        try:
            return PhysicalStoresResponse.model_validate(raw_json)
        except ValidationError as e:
            raise ValueError(f"Failed to parse PhysicalStoresResponse: {e}")

    def get_physical_store_by_id(self, store_id: str) -> PhysicalStore:
        """
        GET /physical-stores/{id}
        Returns a single PhysicalStore model.
        The endpoint returns the store wrapped in {"data": {...}}.
        """
        raw_json = self._get(f"physical-stores/{store_id}")
        try:
            parsed = SinglePhysicalStoreResponse.model_validate(raw_json)
            return parsed.data
        except ValidationError as e:
            raise ValueError(f"Failed to parse SinglePhysicalStoreResponse: {e}")

    # ----------------------------
    # Products
    # ----------------------------
    def get_products(
        self,
        search: Optional[str] = None,
        page: int = 1,
        size: int = 10,
        vendor: Optional[str] = None,
        brand: Optional[str] = None,
        price_min: Optional[Union[int, float]] = None,
        price_max: Optional[Union[int, float]] = None,
        unique: Optional[bool] = None,
        exclude_without_ean: Optional[bool] = None,
        sort: Optional[str] = None,
    ) -> ProductsResponse:
        """
        GET /products
        Returns a ProductsResponse Pydantic model.
        """
        params: Dict[str, Union[str, int, float]] = {}
        if search:
            params["search"] = search
        params["page"] = page
        params["size"] = size
        if vendor:
            params["vendor"] = vendor
        if brand:
            params["brand"] = brand
        if price_min is not None:
            params["price_min"] = price_min
        if price_max is not None:
            params["price_max"] = price_max
        if unique is not None:
            params["unique"] = str(unique).lower()
        if exclude_without_ean is not None:
            params["exclude_without_ean"] = str(exclude_without_ean).lower()
        if sort:
            params["sort"] = sort

        raw_json = self._get("products", params=params)
        try:
            return ProductsResponse.model_validate(raw_json)
        except ValidationError as e:
            raise ValueError(f"Failed to parse ProductsResponse: {e}")

    def get_product_by_id(self, product_id: int) -> Product:
        """
        GET /products/id/{id}
        Returns a single Product.
        The endpoint returns the product wrapped in {"data": {...}}.
        """
        raw_json = self._get(f"products/id/{product_id}")
        try:
            parsed = SingleProductResponse.model_validate(raw_json)
            return parsed.data
        except ValidationError as e:
            raise ValueError(f"Failed to parse Product: {e}")

    def get_product_by_ean(self, ean: str) -> ProductsByEanData:
        """
        GET /products/ean/{ean}
        Returns the inner data (ProductsByEanData) from a ProductsByEanResponse.
        """
        raw_json = self._get(f"products/ean/{ean}")
        try:
            return ProductsByEanResponse.model_validate(raw_json).data
        except ValidationError as e:
            raise ValueError(f"Failed to parse ProductsByEanResponse: {e}")

    def find_product_by_url_single(self, url: str) -> Product:
        """
        GET /products/find-by-url/single
        Returns a single Product from a response wrapped in {"data": {...}}.
        """
        params: Dict[str, str] = {"url": url}
        raw_json = self._get("products/find-by-url/single", params=params)
        try:
            parsed = FindByUrlResponse.model_validate(raw_json)
            return parsed.data
        except ValidationError as e:
            raise ValueError(f"Failed to parse single-product response: {e}")

    def find_product_by_url_compare(self, url: str) -> ProductsCompareData:
        """
        GET /products/find-by-url/compare
        Returns the inner data (ProductsCompareData) from a ProductsCompareResponse.
        """
        params: Dict[str, str] = {"url": url}
        raw_json = self._get("products/find-by-url/compare", params=params)
        try:
            return ProductsCompareResponse.model_validate(raw_json).data
        except ValidationError as e:
            raise ValueError(f"Failed to parse compare-products response: {e}")
