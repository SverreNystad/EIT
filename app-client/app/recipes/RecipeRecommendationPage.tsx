import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '@/constants/Colors';
import { RecipeStackParamList } from './_layout';
import { recommendedRecipes } from '@/services/api';
import {
  MealRecommendationRequest,
  RecommendedRecipesResponse,
  MealRecommendationResponse,
} from '@/types/recipes';
// The same parser you used in SingleRecipePage:
import { parseImagesString } from './utils';

/** 
 * A fallback local image for recipes without an image. 
 */
const defaultImage = require('@/assets/images/test.png');

const PROFILE_STORAGE_KEY = 'userProfileData';

type RecipeRecommendationPageNavProp = StackNavigationProp<
  RecipeStackParamList,
  'recommendations'
>;

export default function RecipeRecommendationPage() {
  const navigation = useNavigation<RecipeRecommendationPageNavProp>();
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  const [mealData, setMealData] = useState<RecommendedRecipesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);

        let userData: {
          gender: string;
          weight: number;
          height: number;
          age: number;
          activity: string;
          objective: string;
        } = {
          // Default fallback
          gender: 'male',
          weight: 70,
          height: 175,
          age: 25,
          activity: 'sedentary',
          objective: 'weight_loss',
        };

        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          userData = {
            gender: parsed.gender || 'male',
            weight: parsed.weight || 70,
            height: parsed.height || 175,
            age: parsed.age || 25,
            activity: parsed.activity || 'sedentary',
            objective: parsed.objective || 'weight_loss',
          };
        }

        const requestPayload: MealRecommendationRequest = {
          category: userData.gender as 'male' | 'female',
          body_weight: userData.weight,
          body_height: userData.height,
          age: userData.age,
          activity_intensity: userData.activity as MealRecommendationRequest['activity_intensity'],
          objective: userData.objective as MealRecommendationRequest['objective'],
        };

        const response: RecommendedRecipesResponse = await recommendedRecipes(requestPayload);
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

  const renderCard = ({ item }: { item: MealRecommendationResponse }) => {
    // parse images
    const imageUrls = parseImagesString(item.Images ?? '');
    const firstImageUrl = imageUrls[0] ?? null;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => handleRecipePress(item)}
        activeOpacity={0.8}
      >
        <Image
          source={firstImageUrl ? { uri: firstImageUrl } : defaultImage}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
            {item.Name}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.text }]}>
            {Math.round(item.Calories)} kcal
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMealSection = (
    title: string,
    data: MealRecommendationResponse[] | undefined
  ) => {
    if (!data || data.length === 0) return null;

    return (
      <View style={styles.mealSection}>
        <Text style={[styles.mealTitle, { color: theme.text }]}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.RecipeId.toString()}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.mealContentContainer}
          
        />
      </View>
      
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Henter anbefalte oppskrifter...
        </Text>
      </View>
    );
  }

  if (!mealData) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Ingen oppskrifter tilgjengelig.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
     

      {renderMealSection('Frokost', mealData.breakfast)}
      {renderMealSection('Lunsj', mealData.lunch)}
      {renderMealSection('Middag', mealData.dinner)}
      {renderMealSection('Andre anbefalinger', mealData.suggestions)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:15
  },
  scrollContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  /* Header */
  pageHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  /* Meal Section */
  mealSection: {
    marginBottom: 20,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  mealContentContainer: {
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },

  /* Card */
  card: {
    flex: 0.48, // to fit 2 in a row with some space
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,

    // Android elevation
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
});
