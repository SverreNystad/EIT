// SingleRecipePage.tsx
import React from 'react';
import {
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RecipeStackParamList } from './_layout';
import { getTheme } from '@/constants/Colors';
import { parseImagesString, parseInstructionsString } from './utils'; // Your images parser helper
type SingleRecipePageRouteProp = RouteProp<RecipeStackParamList, 'singleRecipe'>;

export default function SingleRecipePage() {
  const { params } = useRoute<SingleRecipePageRouteProp>();
  const { recipe } = params;
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  const imageUrls = parseImagesString(recipe.Images ?? '');
  const instructions = parseInstructionsString(recipe.RecipeInstructions ?? '');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Recipe Image(s) Section */}
      <View style={styles.imageContainer}>
        {imageUrls.length > 0 ? (
          <FlatList
            data={imageUrls}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: theme.text, opacity: 0.6 }}>No Image Available</Text>
          </View>
        )}
      </View>

      {/* Main Recipe Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{recipe.Name}</Text>
        <Text style={[styles.author, { color: theme.text }]}>by {recipe.AuthorName}</Text>

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

        <View style={styles.timesRow}>
          {recipe.CookTime ? (
            <Text style={[styles.timesText, { color: theme.text }]}>
              Cook: {recipe.CookTime.replace('PT', '')}
            </Text>
          ) : null}
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
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Description</Text>
        <Text style={[styles.sectionBody, { color: theme.text }]}>
          {recipe.Description || 'No description available.'}
        </Text>
      </View>

      {/* Instructions as a Numbered List */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Instructions</Text>
        {instructions.length > 0 ? (
          instructions.map((step: string, index: number) => (
            <View key={index} style={styles.instructionStep}>
              <Text style={[styles.instructionNumber, { color: theme.primary }]}>{index + 1}.</Text>
              <Text style={[styles.instructionText, { color: theme.text }]}>{step}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.sectionBody, { color: theme.text }]}>
            No instructions available.
          </Text>
        )}
      </View>

      {/* Nutritional Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Nutritional Info</Text>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Calories:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>{Math.round(recipe.Calories)} kcal</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Protein:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>{Math.round(recipe.ProteinContent)} g</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Carbs:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>{Math.round(recipe.CarbohydrateContent)} g</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Fat:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>{Math.round(recipe.FatContent)} g</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.primary }]}>
          <Text style={[styles.ctaText, { color: theme.background }]}>Save to Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.background }]}>
          <Text style={[styles.ctaText, { color: theme.text }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Dimensions for the image area
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
    width: width,
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
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
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
