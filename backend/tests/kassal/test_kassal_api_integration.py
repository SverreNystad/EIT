import pytest
from src.kassal.kassal_service import KassalAPI
from src.kassal.models_physical_stores import PhysicalStoresResponse, PhysicalStore
from src.kassal.models_products import ProductsResponse, Product
from src.kassal.models_products_ean import ProductsByEanData
from src.kassal.models_products_compare import ProductsCompareData


# Example: a fixture that returns a real API instance; see your conftest.py for details.
@pytest.fixture(scope="session")
def real_api() -> KassalAPI:
    import os

    token = os.getenv("KASSAL_API_TOKEN")
    if not token:
        pytest.skip("KASSAL_API_TOKEN not set. Skipping integration tests.")
    return KassalAPI(token=token)


@pytest.mark.apitest
def test_get_physical_stores_integration(real_api: KassalAPI):
    """
    Integration test: list physical stores.
    """
    response = real_api.get_physical_stores(search="Oslo", page=1, size=2)
    assert isinstance(response, PhysicalStoresResponse)
    assert len(response.data) > 0
    assert isinstance(response.data[0], PhysicalStore)


@pytest.mark.apitest
def test_get_physical_store_by_id_integration(real_api: KassalAPI):
    """
    Integration test: retrieve a single store by ID.
    Use an ID known to exist (e.g. "3" if valid).
    """
    store_id = "3"
    try:
        store = real_api.get_physical_store_by_id(store_id)
        assert isinstance(store, PhysicalStore)
        assert store.id == int(store_id)
    except Exception as e:
        pytest.fail(f"Failed to retrieve store id={store_id}. Error: {e}")


@pytest.mark.apitest
def test_get_products_integration(real_api: KassalAPI):
    """
    Integration test: search for products with 'lettmelk'.
    """
    response = real_api.get_products(search="lettmelk", page=1, size=2)
    assert isinstance(response, ProductsResponse)
    assert len(response.data) > 0
    assert response.data[0].name is not None


@pytest.mark.apitest
def test_get_product_by_id_integration(real_api: KassalAPI):
    """
    Integration test: retrieve a product by its ID.
    Replace with a known valid product ID.
    """
    product_id = 1  # Adjust as needed
    try:
        product = real_api.get_product_by_id(product_id)
        assert product.id == product_id
        assert isinstance(product, Product)
    except Exception as e:
        pytest.fail(f"Failed to get product by ID={product_id}. Error: {e}")


@pytest.mark.apitest
def test_get_product_by_ean_integration(real_api: KassalAPI):
    """
    Integration test: retrieve product(s) by EAN.
    """
    ean = "7039010019743"  # Example EAN – adjust as needed.
    try:
        result = real_api.get_product_by_ean(ean)

        assert isinstance(result, ProductsByEanData)
        assert result.ean == ean
        # Optionally check for products list length
    except Exception as e:
        pytest.fail(f"Failed to get product by EAN={ean}. Error: {e}")


@pytest.mark.apitest
def test_find_product_by_url_single_integration(real_api: KassalAPI):
    """
    Integration test: find a single product by URL.
    """
    url = "https://meny.no/Varer/middag/pizza/pizza/grandiosa-pizza-7039010576963"
    try:
        single_product = real_api.find_product_by_url_single(url)
        assert single_product.ean == "7039010576963"
        assert isinstance(single_product, Product)
    except Exception as e:
        pytest.fail(f"Failed to find product by URL single. Error: {e}")


@pytest.mark.apitest
def test_find_product_by_url_compare_integration(real_api: KassalAPI):
    """
    Integration test: compare a product by URL.
    """
    url = "https://meny.no/Varer/middag/pizza/pizza/grandiosa-pizza-7039010577298"
    try:
        compare_result = real_api.find_product_by_url_compare(url)

        assert isinstance(compare_result, ProductsCompareData)
        assert compare_result.ean == "7039010577298"
        assert len(compare_result.products) > 0
    except Exception as e:
        pytest.fail(f"Failed to find product by URL compare. Error: {e}")
