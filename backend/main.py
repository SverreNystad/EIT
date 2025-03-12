from typing import Optional, Union

import pandas as pd
from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from src.configuration import KASSAL_API_KEY
from src.kassal.kassal_service import KassalAPI
from src.kassal.models_physical_stores import PhysicalStoresResponse, PhysicalStore
from src.kassal.models_products import ProductsResponse, Product
from src.kassal.models_products_ean import ProductsByEanData
from src.kassal.models_products_compare import ProductsCompareData
from src.recommenders.meal_plan_service import generate_meal_plan, suggest_recipes
from src.recommenders.models import MealRecommendationRequest, _transform_df_to_pydantic


app = FastAPI(
    title="EiT backend",
    description="Backend for EiT project",
    version="0.0.2",
)


origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://techtaitans.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


kassal_api = KassalAPI(token=KASSAL_API_KEY)


@app.get("/physical-stores", response_model=PhysicalStoresResponse)
async def get_physical_stores(
    search: Optional[str] = Query(None, description="Search term for physical stores"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, description="Number of items per page"),
    lat: Optional[float] = Query(
        None, description="Latitude for location-based search"
    ),
    lng: Optional[float] = Query(
        None, description="Longitude for location-based search"
    ),
    km: float = Query(5, ge=0, description="Radius in kilometers"),
    group: Optional[str] = Query(None, description="Group filter"),
):
    try:
        result = kassal_api.get_physical_stores(
            search=search, page=page, size=size, lat=lat, lng=lng, km=km, group=group
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/physical-stores/{store_id}", response_model=PhysicalStore)
async def get_physical_store_by_id(
    store_id: str = Path(..., description="ID of the physical store")
):
    try:
        result = kassal_api.get_physical_store_by_id(store_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/products", response_model=ProductsResponse)
async def get_products(
    search: Optional[str] = Query(None, description="Search term for products"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, description="Number of items per page"),
    vendor: Optional[str] = Query(None, description="Vendor filter"),
    brand: Optional[str] = Query(None, description="Brand filter"),
    price_min: Optional[Union[int, float]] = Query(
        None, ge=0, description="Minimum price"
    ),
    price_max: Optional[Union[int, float]] = Query(
        None, ge=0, description="Maximum price"
    ),
    unique: Optional[bool] = Query(None, description="Return only unique products"),
    exclude_without_ean: Optional[bool] = Query(
        None, description="Exclude products without an EAN"
    ),
    sort: Optional[str] = Query(None, description="Sort order"),
):
    try:
        result = kassal_api.get_products(
            search=search,
            page=page,
            size=size,
            vendor=vendor,
            brand=brand,
            price_min=price_min,
            price_max=price_max,
            unique=unique,
            exclude_without_ean=exclude_without_ean,
            sort=sort,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/products/id/{product_id}", response_model=Product)
async def get_product_by_id(
    product_id: int = Path(..., description="ID of the product")
):
    try:
        result = kassal_api.get_product_by_id(product_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/products/ean/{ean}", response_model=ProductsByEanData)
async def get_product_by_ean(ean: str = Path(..., description="EAN of the product")):
    try:
        result = kassal_api.get_product_by_ean(ean)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/products/find-by-url/single", response_model=Product)
async def find_product_by_url_single(
    url: str = Query(..., description="URL of the product to find")
):
    try:
        result = kassal_api.find_product_by_url_single(url)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/products/find-by-url/compare", response_model=ProductsCompareData)
async def find_product_by_url_compare(
    url: str = Query(..., description="URL of the product for comparison")
):
    try:
        result = kassal_api.find_product_by_url_compare(url)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/recipes/recommend")
async def recommend_recipes(request: MealRecommendationRequest):
    category = request.category.value
    body_weight = request.body_weight
    body_height = request.body_height
    age = request.age
    activity_intensity = request.activity_intensity.value
    objective = request.objective.value
    tolerance = request.tolerance
    num_suggestions = request.suggestions

    recipes_df = pd.read_csv("data/recipes.csv")
    breakfast_options, lunch_options, dinner_options = generate_meal_plan(
        category,
        body_weight,
        body_height,
        age,
        activity_intensity,
        objective,
        recipes_df,
        tolerance,
    )

    suggestions = suggest_recipes(
        category,
        body_weight,
        body_height,
        age,
        activity_intensity,
        objective,
        recipes_df,
        num_suggestions,
    )

    # Ensure that the options are not longer than the number of suggestions
    breakfast_options = breakfast_options.head(num_suggestions)
    lunch_options = lunch_options.head(num_suggestions)
    dinner_options = dinner_options.head(num_suggestions)

    breakfast_options = _transform_df_to_pydantic(breakfast_options)
    lunch_options = _transform_df_to_pydantic(lunch_options)
    dinner_options = _transform_df_to_pydantic(dinner_options)
    suggestions = _transform_df_to_pydantic(suggestions)

    return {
        "breakfast": breakfast_options,
        "lunch": lunch_options,
        "dinner": dinner_options,
        "suggestions": suggestions,
    }
