export interface MealRecommendationRequest {
  category: "male" | "female";
  body_weight: number;
  body_height: number;
  age: number;
  activity_intensity:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
  objective: "weight_loss" | "muscle_gain" | "health_maintenance";
  tolerance?: number;
  suggestions?: number;
}

export interface MealRecommendationResponse {
  RecipeId: number;
  Name: string;
  AuthorId: number;
  AuthorName: string;
  CookTime?: string | null;
  PrepTime: string;
  TotalTime: string;
  DatePublished: string; // ISO date string from the backend
  Description?: string | null;
  Images?: string | null;
  RecipeCategory?: string | null;
  Keywords?: string | null;
  RecipeIngredientQuantities?: string | null;
  RecipeIngredientParts: string;
  AggregatedRating?: number | null;
  ReviewCount?: number | null;
  Calories: number;
  FatContent: number;
  SaturatedFatContent: number;
  CholesterolContent: number;
  SodiumContent: number;
  CarbohydrateContent: number;
  FiberContent: number;
  SugarContent: number;
  ProteinContent: number;
  RecipeServings?: number | null;
  RecipeYield?: string | null;
  RecipeInstructions: string;
}

export interface RecommendedRecipesResponse {
  breakfast: MealRecommendationResponse[];
  lunch: MealRecommendationResponse[];
  dinner: MealRecommendationResponse[];
  suggestions: MealRecommendationResponse[];
}
