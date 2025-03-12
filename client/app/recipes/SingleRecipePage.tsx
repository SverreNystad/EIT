import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { RecipeStackParamList } from './_layout';
import { getTheme } from '@/constants/Colors';
import { MealRecommendationResponse } from '@/types/recipes';

type SingleRecipePageRouteProp = RouteProp<RecipeStackParamList, 'singleRecipe'>;

export default function SingleRecipePage() {
  const { params } = useRoute<SingleRecipePageRouteProp>();
  const { recipe } = params;
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{recipe.Name}</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        By {recipe.AuthorName}
      </Text>

      {/* Show any relevant data here. Example: */}
      <Text style={[styles.sectionHeader, { color: theme.text }]}>
        Description
      </Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>
        {recipe.Description || 'No description available.'}
      </Text>

      <Text style={[styles.sectionHeader, { color: theme.text }]}>
        Instructions
      </Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>
        {recipe.RecipeInstructions}
      </Text>

      <Text style={[styles.sectionHeader, { color: theme.text }]}>
        Nutritional Info
      </Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>
        Calories: {recipe.Calories}
      </Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>
        Protein: {recipe.ProteinContent}
      </Text>
      {/* Display more nutritional data as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
  },
});
