import React from 'react';
import {
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
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

  /**
   * Attempt to parse and display the first image if available.
   * If `Images` is not a valid URL or empty, display a placeholder instead.
   */
  const parseRecipeImage = (): string | null => {
    if (!recipe.Images) return null;
    console.log('====================================');
    console.log('Recipe Images:', recipe.Images);
    console.log('====================================');
    // Your CSV might store images in a tricky format, e.g. "c(""url1"", ""url2"")"
    // If you have a known format, you can parse it. For now, let's assume it might be
    // a single URL or a comma-separated list. Adjust this parsing as needed:
    const potentialUrls = recipe.Images.split(',').map((url: string) => url.replace(/[^A-Za-z0-9_\-.:/]/g, '').trim());
    // If the first item appears to be a valid URL, return it:
    if (potentialUrls.length > 0 && potentialUrls[0].startsWith('http')) {
      return potentialUrls[0];
    }
    return null;
  };

  const imageUrl = parseRecipeImage();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Recipe Image Section */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.cardBackground }]}>
            <Text style={{ color: theme.text, opacity: 0.6 }}>
              No Image Available
            </Text>
          </View>
        )}
      </View>

      {/* Main Recipe Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{recipe.Name}</Text>
        <Text style={[styles.author, { color: theme.text }]}>by {recipe.AuthorName}</Text>

        {/* Rating and Reviews */}
        {(recipe.AggregatedRating || recipe.ReviewCount) && (
          <View style={styles.ratingContainer}>
            {recipe.AggregatedRating && (
              <Text style={[styles.ratingText, { color: theme.text }]}>
                Rating: {recipe.AggregatedRating.toFixed(1)}
              </Text>
            )}
            {recipe.ReviewCount && (
              <Text style={[styles.ratingText, { color: theme.text }]}>
                ({recipe.ReviewCount} reviews)
              </Text>
            )}
          </View>
        )}

        {/* Cook/Prep/Total Times */}
        <View style={styles.timesRow}>
          {!!recipe.CookTime && (
            <Text style={[styles.timesText, { color: theme.text }]}>
              Cook: {recipe.CookTime.replace('PT', '')}
            </Text>
          )}
          <Text style={[styles.timesText, { color: theme.text }]}>
            Prep: {recipe.PrepTime.replace('PT', '')}
          </Text>
          <Text style={[styles.timesText, { color: theme.text }]}>
            Total: {recipe.TotalTime.replace('PT', '')}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>
          Description
        </Text>
        <Text style={[styles.sectionBody, { color: theme.text }]}>
          {recipe.Description || 'No description available.'}
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>
          Instructions
        </Text>
        <Text style={[styles.sectionBody, { color: theme.text }]}>
          {recipe.RecipeInstructions}
        </Text>
      </View>

      {/* Nutritional Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>
          Nutritional Info
        </Text>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>
            Calories:
          </Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.Calories)}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>
            Protein:
          </Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.ProteinContent)} g
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>
            Carbs:
          </Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.CarbohydrateContent)} g
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>
            Fat:
          </Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.FatContent)} g
          </Text>
        </View>
        {/* Add additional nutrients (Fiber, Sugar, etc.) as needed */}
      </View>

      {/* Example "Add to Favorites" or "Share" Button */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.primary }]}>
          <Text style={[styles.ctaText, { color: theme.background }]}>Save to Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.ctaText, { color: theme.text }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Screen/Device width for image sizing
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width * 0.6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 15,
    marginRight: 10,
  },
  timesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timesText: {
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  nutritionLabel: {
    width: 100,
    fontWeight: '500',
  },
  nutritionValue: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  ctaButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
