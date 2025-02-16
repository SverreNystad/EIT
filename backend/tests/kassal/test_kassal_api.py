import pytest
from unittest.mock import patch, MagicMock
from requests.exceptions import HTTPError

from src.kassal.kassal_service import KassalAPI
from src.kassal.models_physical_stores import PhysicalStoresResponse, PhysicalStore
from src.kassal.models_products import ProductsResponse
from src.kassal.models_products_ean import ProductsByEanData
from src.kassal.models_products_compare import ProductsCompareData


@pytest.fixture
def api() -> KassalAPI:
    """Fixture that returns a KassalAPI instance with a dummy token."""
    return KassalAPI(token="dummy_token")


@patch("requests.get")
def test_get_physical_stores_success(mock_get, api: KassalAPI):
    """Test get_physical_stores returns a valid PhysicalStoresResponse on success."""
    # Mock JSON fixture matching the PhysicalStoresResponse shape.
    mock_response_json = {
        "data": [
            {
                "id": 1,
                "group": "MENY_NO",
                "name": "Meny Flåtten",
                "address": "Deichmansgt.109, 3924, Porsgrunn",
                "phone": "35 93 30 00",
                "email": "butikksjef.flatten@meny.no",
                "fax": "35 93 30 01",
                "logo": "http://localhost/logos/Meny.svg",
                "website": "https://meny.no/finn-butikk/meny-flatten",
                "detailUrl": "http://localhost/butikker/1-meny-flatten",
                "position": {"lat": "59.12145140", "lng": "9.65896053"},
                "openingHours": {
                    "monday": "07:00-22:00",
                    "tuesday": "07:00-22:00",
                    "wednesday": "07:00-22:00",
                    "thursday": "07:00-22:00",
                    "friday": "07:00-22:00",
                    "saturday": "07:00-20:00",
                    "sunday": None,
                },
            }
        ],
        "links": {
            "first": "http://localhost/api/v1/physical-stores?page=1",
            "last": "http://localhost/api/v1/physical-stores?page=2",
            "prev": None,
            "next": None,
        },
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 2,
            "links": [],
            "path": "http://localhost/api/v1/physical-stores",
            "per_page": 10,
            "to": 1,
            "total": 10,
        },
    }

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_response_json
    mock_get.return_value = mock_response

    result = api.get_physical_stores(search="Oslo")
    # Assert that the result is a PhysicalStoresResponse and that nested objects parse correctly.
    assert isinstance(result, PhysicalStoresResponse)
    assert len(result.data) > 0
    assert isinstance(result.data[0], PhysicalStore)
    assert result.data[0].name == "Meny Flåtten"


@patch("requests.get")
def test_get_physical_stores_rate_limit_exceeded(mock_get, api: KassalAPI):
    """Test that get_physical_stores raises an exception if a 429 is returned."""
    mock_response = MagicMock()
    mock_response.status_code = 429
    mock_get.return_value = mock_response

    with pytest.raises(Exception) as excinfo:
        api.get_physical_stores(search="Oslo")
    assert "Rate limit exceeded" in str(excinfo.value)


@patch("requests.get")
def test_get_products_success(mock_get, api: KassalAPI):
    """Test get_products returns a valid ProductsResponse on success."""
    # Minimal valid JSON matching the ProductsResponse shape.
    mock_response_json = {
        "data": [
            {
                "id": 1,
                "name": "Pepsi Max 1,5l x4",
                "brand": "Pepsi",
                "vendor": "Ringnes as",
                "ean": "7044618874687",
                "url": "https://spar.no/product-url",
                "image": "https://bilder.ngdata.no/7044618874687/large.jpg",
                "description": "Sample description",
                "ingredients": "Water, sweeteners",
                "current_price": 89.9,
                "current_unit_price": 14.98,
                "weight": 6000,
                "weight_unit": "ml",
                "store": {
                    "name": "SPAR",
                    "code": "SPAR_NO",
                    "url": "https://spar.no",
                    "logo": "http://localhost/logos/Spar.svg",
                },
                "price_history": [
                    {"price": 89.9, "date": "2023-09-06T00:56:48.000000Z"}
                ],
                "allergens": [],
                "nutrition": [],
                "created_at": "2023-09-07T02:51:38.000000Z",
                "updated_at": "2023-09-07T02:51:38.000000Z",
            }
        ],
        "links": {
            "first": "http://localhost/api/v1/products?page=1",
            "last": None,
            "prev": None,
            "next": None,
        },
        "meta": {
            "current_page": 1,
            "from": 1,
            "path": "http://localhost/api/v1/products",
            "per_page": 10,
            "to": 10,
        },
    }

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_response_json
    mock_get.return_value = mock_response

    result = api.get_products(search="lettmelk")
    assert isinstance(result, ProductsResponse)
    assert result.data[0].name == "Pepsi Max 1,5l x4"


@patch("requests.get")
def test_get_product_by_id_raises_http_error(mock_get, api: KassalAPI):
    """Test get_product_by_id raises an HTTP error if response is non-200."""
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_response.raise_for_status.side_effect = HTTPError("Not Found")
    mock_get.return_value = mock_response

    with pytest.raises(HTTPError):
        api.get_product_by_id(999999)


@patch("requests.get")
def test_get_product_by_ean_success(mock_get, api: KassalAPI):
    """Test get_product_by_ean returns a valid ProductsByEanData on success."""
    mock_json = {
        "data": {
            "ean": "7039010019828",
            "products": [],
            "allergens": [],
            "nutrition": [],
        }
    }
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_json
    mock_get.return_value = mock_response

    result = api.get_product_by_ean("7039010019828")

    assert isinstance(result, ProductsByEanData)
    assert result.ean == "7039010019828"
    assert result.products == []


@patch("requests.get")
def test_find_product_by_url_compare_success(mock_get, api: KassalAPI):
    """Test find_product_by_url_compare returns a valid ProductsCompareData on success."""
    mock_json = {
        "data": {
            "ean": "7039010577298",
            "products": [],
            "allergens": [],
            "nutrition": [],
        }
    }
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_json
    mock_get.return_value = mock_response

    result = api.find_product_by_url_compare("https://meny.no/product-url")

    assert isinstance(result, ProductsCompareData)
    assert result.ean == "7039010577298"
    assert result.products == []
