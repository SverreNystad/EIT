import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { getTheme } from '@/constants/Colors';
import { RecipeStackParamList } from './_layout';
import { recommendedRecipes } from '@/services/api';
import {
  MealRecommendationRequest,
  RecommendedRecipesResponse,
  MealRecommendationResponse,
} from '@/types/recipes';

type RecipeRecommendationPageNavProp = StackNavigationProp<
  RecipeStackParamList,
  'recommendations'
>;

export default function RecipeRecommendationPage() {
  const navigation = useNavigation<RecipeRecommendationPageNavProp>();
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  // Store the entire response object rather than combining into one array
  const [mealData, setMealData] = useState<RecommendedRecipesResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);

        // Example user data (replace with real user input)
        const requestPayload: MealRecommendationRequest = {
          category: 'male',
          body_weight: 70,
          body_height: 175,
          age: 25,
          activity_intensity: 'sedentary',
          objective: 'weight_loss',
        };

        // Fetch recommended recipes from your backend
        const response: RecommendedRecipesResponse = await recommendedRecipes(
          requestPayload
        );
        setMealData(response);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const handleRecipePress = (recipe: MealRecommendationResponse) => {
    navigation.navigate('singleRecipe', { recipe });
  };

  /**
   * Renders a single item (recipe card) for a FlatList.
   */
  const renderCard = ({ item }: { item: MealRecommendationResponse }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.background }]}
      onPress={() => handleRecipePress(item)}
    >
      {/* If you have a valid image URL in `item.Images`, you can render an Image here */}
      <Text style={[styles.cardTitle, { color: theme.text }]}>
        {item.Name}
      </Text>
      <Text style={[styles.cardSubtitle, { color: theme.text }]}>
        {Math.round(item.Calories)} kcal
      </Text>
    </TouchableOpacity>
  );

  /**
   * Renders a section (e.g., Breakfast, Lunch, Dinner, Suggestions)
   * with a title and a FlatList of recipes.
   */
  const renderMealSection = (
    title: string,
    data: MealRecommendationResponse[] | undefined
  ) => {
    // If there's no data or an empty array, we skip rendering
    if (!data || data.length === 0) return null;

    return (
      <View style={styles.mealSection}>
        <Text style={[styles.mealTitle, { color: theme.text }]}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.RecipeId.toString()}
          renderItem={renderCard}
          numColumns={2} // 2-column grid for each section
          contentContainerStyle={styles.mealContentContainer}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // If there is no mealData at this point, there's likely an error or empty response
  if (!mealData) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No recipes available.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {renderMealSection('Breakfast', mealData.breakfast)}
      {renderMealSection('Lunch', mealData.lunch)}
      {renderMealSection('Dinner', mealData.dinner)}
      {renderMealSection('Suggestions', mealData.suggestions)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealSection: {
    marginBottom: 20,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  mealContentContainer: {
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    padding: 12,
    // Optional elevation for Android
    // elevation: 2,
    // Optional shadow for iOS
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
});
