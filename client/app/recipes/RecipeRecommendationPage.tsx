import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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

  const [recipes, setRecipes] = useState<MealRecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);

        // TODO - Replace with actual user data
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

        // Combine all recipe arrays into one if desired
        const combined = [
          ...response.breakfast,
          ...response.lunch,
          ...response.dinner,
          ...response.suggestions,
        ];
        setRecipes(combined);
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

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const renderCard = ({ item }: { item: MealRecommendationResponse }) => (
    <TouchableOpacity
      //style={[styles.card, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleRecipePress(item)}
    >
      {/* If you have a valid image URL in `item.Images`, you can render an Image here */}
      <Text style={[styles.cardTitle, { color: theme.text }]}>{item.Name}</Text>
      <Text style={[styles.cardSubtitle, { color: theme.text }]}>
        {Math.round(item.Calories)} kcal
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.RecipeId.toString()}
        renderItem={renderCard}
        numColumns={2} // <-- Grid Layout
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    padding: 12,
    // If you want a shadow/elevation:
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
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
