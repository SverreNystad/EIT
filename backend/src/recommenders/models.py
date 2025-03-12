import math
from enum import Enum
from typing import Optional
from datetime import datetime
import pandas as pd
from pydantic import BaseModel, Field


class GenderEnum(str, Enum):
    male = "male"
    female = "female"

class ActivityIntensityEnum(str, Enum):
    sedentary = "sedentary"
    lightly_active = "lightly_active"
    moderately_active = "moderately_active"
    very_active = "very_active"
    extra_active = "extra_active"

class ObjectiveEnum(str, Enum):
    weight_loss = "weight_loss"
    muscle_gain = "muscle_gain"
    health_maintenance = "health_maintenance"

class MealRecommendationRequest(BaseModel):
    category: GenderEnum
    body_weight: float
    body_height: float
    age: int = Field(..., gt=0, description="Age must be greater than 0")
    activity_intensity: ActivityIntensityEnum
    objective: ObjectiveEnum
    tolerance: int = Field(50, gt=0, description="Tolerance must be greater than 0")
    suggestions: int = Field(5, gt=0, description="Suggestions must be greater than 0")



class MealRecommendationResponse(BaseModel):
    RecipeId: int
    Name: str
    AuthorId: int
    AuthorName: str
    CookTime: Optional[str] = None
    PrepTime: str
    TotalTime: str
    DatePublished: datetime
    Description: Optional[str] = None
    Images: Optional[str] = None
    RecipeCategory: Optional[str] = None
    Keywords: Optional[str] = None
    RecipeIngredientQuantities: Optional[str] = None
    RecipeIngredientParts: str
    AggregatedRating: Optional[float] = None
    ReviewCount: Optional[float] = None
    Calories: float
    FatContent: float
    SaturatedFatContent: float
    CholesterolContent: float
    SodiumContent: float
    CarbohydrateContent: float
    FiberContent: float
    SugarContent: float
    ProteinContent: float
    RecipeServings: Optional[float] = None
    RecipeYield: Optional[str] = None
    RecipeInstructions: str



def _transform_df_to_pydantic(df: pd.DataFrame) -> list[MealRecommendationResponse]:
    responses = []
    for _, row in df.iterrows():
        data = row.to_dict()
        # Replace NaN values with None
        data = {key: (None if isinstance(value, float) and math.isnan(value) else value)
                for key, value in data.items()}
        responses.append(MealRecommendationResponse(**data))
    return responses