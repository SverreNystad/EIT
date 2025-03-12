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
import { parseImagesString, parseInstructionsString } from './utils';

type SingleRecipePageRouteProp = RouteProp<RecipeStackParamList, 'singleRecipe'>;

export default function SingleRecipePage() {
  const { params } = useRoute<SingleRecipePageRouteProp>();
  const { recipe } = params;

  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  // Convert the Images string into an array of URLs
  const imageUrls = parseImagesString(recipe.Images ?? '');
  // Convert the RecipeInstructions string into an array of steps
  const instructions = parseInstructionsString(recipe.RecipeInstructions ?? '');

  // Split ingredient parts & quantities if needed
  const ingredientParts = parseInstructionsString(recipe.RecipeIngredientParts ?? '');
  const ingredientQuantities = parseInstructionsString(recipe.RecipeIngredientQuantities ?? '');

  // Split keywords similarly
  const keywords = parseImagesString(recipe.Keywords ?? '');

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
            <Text style={{ color: theme.text, opacity: 0.6 }}>
              No Image Available
            </Text>
          </View>
        )}
      </View>

      {/* Main Recipe Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{recipe.Name}</Text>
        <Text style={[styles.author, { color: theme.text }]}>
          by {recipe.AuthorName}
        </Text>

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
          {recipe.CookTime && (
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

      {/* Metadata in Columns */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Details</Text>

        <View style={styles.metadataContainer}>
          {!!recipe.RecipeCategory && (
            <View style={styles.metadataItem}>
              <Text style={[styles.metadataLabel, { color: theme.text }]}>Category</Text>
              <Text style={[styles.metadataValue, { color: theme.text }]}>
                {recipe.RecipeCategory}
              </Text>
            </View>
          )}

          {!!recipe.Keywords && (
            <View style={styles.metadataItem}>
              <Text style={[styles.metadataLabel, { color: theme.text }]}>Keywords</Text>
              <Text style={[styles.metadataValue, { color: theme.text }]}>
                {keywords.join(', ')}
              </Text>
            </View>
          )}

          {!!recipe.RecipeServings && (
            <View style={styles.metadataItem}>
              <Text style={[styles.metadataLabel, { color: theme.text }]}>Servings</Text>
              <Text style={[styles.metadataValue, { color: theme.text }]}>
                {recipe.RecipeServings}
              </Text>
            </View>
          )}

          {!!recipe.RecipeYield && (
            <View style={styles.metadataItem}>
              <Text style={[styles.metadataLabel, { color: theme.text }]}>Yield</Text>
              <Text style={[styles.metadataValue, { color: theme.text }]}>
                {recipe.RecipeYield}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Description</Text>
        <Text style={[styles.sectionBody, { color: theme.text }]}>
          {recipe.Description || 'No description available.'}
        </Text>
      </View>

      {/* Ingredients */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Ingredients</Text>
        {ingredientParts.length > 0 ? (
          ingredientParts.map((part: string, idx: number) => {
            const quantity = ingredientQuantities[idx] || null;
            return (
              <View key={idx} style={styles.ingredientRow}>
                {quantity && (
                  <Text style={[styles.ingredientQuantity, { color: theme.primary }]}>
                    {quantity}{' '}
                  </Text>
                )}
                <Text style={[styles.ingredientText, { color: theme.text }]}>{part}</Text>
              </View>
            );
          })
        ) : (
          <Text style={[styles.sectionBody, { color: theme.text }]}>
            No ingredients available.
          </Text>
        )}
      </View>

      {/* Instructions as a Numbered List */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Instructions</Text>
        {instructions.length > 0 ? (
          instructions.map((step: string, index: number) => (
            <View key={index} style={styles.instructionStep}>
              <Text style={[styles.instructionNumber, { color: theme.primary }]}>
                {index + 1}.
              </Text>
              <Text style={[styles.instructionText, { color: theme.text }]}>
                {step}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.sectionBody, { color: theme.text }]}>
            No instructions available.
          </Text>
        )}
      </View>

      {/* Expanded Nutritional Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Nutritional Info</Text>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Calories:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.Calories)} kcal
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Fat:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.FatContent)} g
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Saturated Fat:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.SaturatedFatContent)} g
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Cholesterol:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.CholesterolContent)} mg
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Sodium:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.SodiumContent)} mg
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Carbs:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.CarbohydrateContent)} g
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Fiber:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.FiberContent)} g
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Sugar:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.SugarContent)} g
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionLabel, { color: theme.text }]}>Protein:</Text>
          <Text style={[styles.nutritionValue, { color: theme.text }]}>
            {Math.round(recipe.ProteinContent)} g
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.primary }]}>
          <Text style={[styles.ctaText, { color: theme.background }]}>
            Save to Favorites
          </Text>
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

  /* Section */
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

  /* Metadata Container for Columns */
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',       // allows wrapping to the next line
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metadataItem: {
    width: '48%',           // roughly 2 items per row
    marginBottom: 10,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: 'bold',     // bolden the metadata label
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 14,
  },

  /* Ingredients */
  ingredientRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  ingredientQuantity: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  ingredientText: {
    flex: 1,
  },

  /* Instructions */
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

  /* Nutrition Rows */
  nutritionRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  nutritionLabel: {
    width: 130,
    fontWeight: 'bold',  // bolden the text
  },
  nutritionValue: {
    flex: 1,
  },

  /* Buttons */
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
