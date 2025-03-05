from typing import Tuple
import pandas as pd

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def generate_meal_plan(
    category: str,
    body_weight: float,
    body_height: float,
    age: int,
    activity_intensity: str,
    objective: str,
    recipes_df: pd.DataFrame,
    tolerance: int = 50,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Generate food recommendations based on user profile and dietary goals.

    Args:
        category (str): Gender of the user ('male' or 'female').
        body_weight (float): Weight of the user in kilograms.
        body_height (float): Height of the user in centimeters.
        age (int): Age of the user in years.
        activity_intensity (str): Physical activity level of the user ('sedentary', 'lightly_active',
                                  'moderately_active', 'very_active', 'extra_active').
        objective (str): Dietary goal of the user ('weight_loss', 'muscle_gain', 'maintain_health').
        recipes_df (pd.DataFrame): DataFrame containing recipe names and calories.
        tolerance (int): Allowable difference from the target calories.

    Returns:
        Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]: Recommended recipes for breakfast, lunch, and dinner.
    """
    # Calculate the Basal Metabolic Rate (BMR)
    bmr_value = _compute_bmr(category, body_weight, body_height, age)

    # Calculate the total daily caloric intake based on activity intensity and goal
    daily_caloric_intake = _compute_daily_caloric_intake(
        bmr_value, activity_intensity, objective
    )

    # Define the proportions of daily calories for each meal
    meal_proportions = {"breakfast": 0.50, "lunch": 0.40, "dinner": 0.10}

    # Calculate caloric targets for each meal
    caloric_targets = {
        meal: int(daily_caloric_intake * prop)
        for meal, prop in meal_proportions.items()
    }

    # Get recipe recommendations for each meal
    breakfast_options = _find_recipes_near_target(
        caloric_targets["breakfast"], recipes_df, tolerance
    )
    lunch_options = _find_recipes_near_target(
        caloric_targets["lunch"], recipes_df, tolerance
    )
    dinner_options = _find_recipes_near_target(
        caloric_targets["dinner"], recipes_df, tolerance
    )

    return breakfast_options, lunch_options, dinner_options
    


def suggest_recipes(
    category: str,
    body_weight: float,
    body_height: float,
    age: int,
    activity_intensity: str,
    objective: str,
    model: Sequential,
    scaler: MinMaxScaler,
    X_scaled: np.ndarray,
    data: pd.DataFrame,
) -> pd.DataFrame:
    """
    Generate food recommendations based on the user's profile and dietary goals.

    Args:
        category (str): Gender category of the user ('male' or 'female').
        body_weight (float): Weight of the user in kilograms.
        body_height (float): Height of the user in centimeters.
        age (int): Age of the user in years.
        activity_intensity (str): Physical activity level of the user ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active').
        objective (str): Dietary objective of the user ('weight_loss', 'muscle_gain', 'health_maintenance').

    Return:
        pd.DataFrame: Recommended recipes including name and calorie content.
    """
    # Calculate the Basal Metabolic Rate (BMR) for the user
    bmr = _compute_bmr(category, body_weight, body_height, age)

    # Calculate the total daily caloric intake based on activity intensity and dietary objective
    total_calories = _compute_daily_caloric_intake(bmr, activity_intensity, objective)

    # Prepare input data for the model with desired total calories
    user_input_features = np.array([[total_calories, 0, 0, 0, 0, 0, 0, 0, 0]])

    # Scale the input data to match the model's training scale
    scaled_input_features = scaler.transform(user_input_features)

    # Predict latent features for the input data
    predicted_latent_features = model.predict(scaled_input_features)

    # Find the index with the highest prediction probability
    top_prediction_index = np.argmax(predicted_latent_features.flatten())

    recommendations_dict = _generate_recipe_recommendations(model, X_scaled)
    # Retrieve recommended recipes based on the highest prediction
    similar_recipe_indices = np.array(recommendations_dict[top_prediction_index])
    recommended_recipes = data.iloc[similar_recipe_indices[:, 1].astype(int)][
        ["Name", "Calories"]
    ]

    return recommended_recipes.head(5)


def _compute_bmr(gender, body_weight, body_height, age):
    """
    Calculate Basal Metabolic Rate (BMR) based on gender, body weight, body height, and age.

    Args:
        gender (str): Gender of the individual ('male' or 'female').
        body_weight (float): Body weight of the individual in kilograms.
        body_height (float): Body height of the individual in centimeters.
        age (int): Age of the individual in years.

    Return:
        float: Basal Metabolic Rate (BMR) value.
    """
    if gender == "male":
        # For Men: BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) + 5
        bmr_value = 10 * body_weight + 6.25 * body_height - 5 * age + 5
    elif gender == "female":
        # For Women: BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) - 161
        bmr_value = 10 * body_weight + 6.25 * body_height - 5 * age - 161
    else:
        raise ValueError("Invalid gender. Please choose 'male' or 'female'.")
    return bmr_value


def _compute_daily_caloric_intake(bmr, activity_intensity, objective):
    """
    Calculate total daily caloric intake based on Basal Metabolic Rate (BMR), activity level, and personal goal.

    Args:
        bmr (float): Basal Metabolic Rate (BMR) value.
        activity_intensity (str): Activity level of the individual ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active').
        objective (str): Personal goal of the individual ('weight_loss', 'muscle_gain', 'health_maintenance').

    Return:
        int: Total daily caloric intake.
    """
    # Define activity multipliers based on intensity
    intensity_multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9,
    }

    # Define goal adjustments based on objective
    objective_adjustments = {
        "weight_loss": 0.8,
        "muscle_gain": 1.2,
        "health_maintenance": 1,
    }

    # Calculate maintenance calories based on activity intensity
    maintenance_calories = bmr * intensity_multipliers[activity_intensity]

    # Adjust maintenance calories based on personal objective
    total_caloric_intake = maintenance_calories * objective_adjustments[objective]

    return round(total_caloric_intake)


def _generate_recipe_recommendations(model, X_scaled):
    """
    Generate a dictionary of recommended recipes based on the trained autoencoder model.

    Args:
        model (Sequential): Trained autoencoder model.
        X_scaled (np.ndarray): Scaled input features for the model.

    Return:
        dict: Dictionary of recommended recipes based on the model predictions.
    """
    # Predict latent features for the input data
    predicted_latent_features = model.predict(X_scaled)

    similarity_matrix = cosine_similarity(predicted_latent_features)

    recommendations = {}
    # Iterate over each item in the dataset
    for item_index in range(len(X_scaled)):
        # Sort indices based on similarity in descending order
        sorted_indices = similarity_matrix[item_index].argsort()[::-1]

        # Create a list of tuples with similarity scores and indices, excluding the item itself
        similar_items_list = [
            (similarity_matrix[item_index][idx], idx)
            for idx in sorted_indices
            if idx != item_index
        ]

        # Store the list of similar items for the current item in the recommendations dictionary
        recommendations[item_index] = similar_items_list
    return recommendations



def _find_recipes_near_target(caloric_goal, recipes_df, tolerance=50):
    """
    Find recipes close to the caloric goal.

    Args:
        caloric_goal (int): Target calories for the meal.
        recipes_df (pd.DataFrame): DataFrame containing recipe names and calories.
        tolerance (int): Allowable difference from the target calories.

    Returns:
        pd.DataFrame: Recommended recipes close to the caloric goal.
    """
    # Filter recipes within the tolerance range of the caloric goal
    matching_recipes = recipes_df[
        (recipes_df["Calories"] >= caloric_goal - tolerance)
        & (recipes_df["Calories"] <= caloric_goal + tolerance)
    ]

    # Return an empty DataFrame if no recipes match the caloric goal
    if matching_recipes.empty:
        return pd.DataFrame()

    return matching_recipes


if __name__ == "__main__":
    # Define the input values
    user_category = "male"
    user_body_weight = 80  # in kilograms
    user_body_height = 170  # in centimeters
    user_age = 50  # in years
    user_activity_intensity = "moderately_active"
    user_objective = "weight_loss"

    generate_meal_plan(
        user_category,
        user_body_weight,
        user_body_height,
        user_age,
        user_activity_intensity,
        user_objective,
        recipes_df,
    )