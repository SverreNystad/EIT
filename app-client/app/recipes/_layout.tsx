import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import RecipeRecommendationPage from './RecipeRecommendationPage';
import SingleRecipePage from './SingleRecipePage';

// Define the type for our Recipe stack routes
export type RecipeStackParamList = {
  recommendations: undefined;
  singleRecipe: { recipe: any };
};

const Stack = createStackNavigator<RecipeStackParamList>();

export default function RecipeStackLayout() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen
        name="recommendations"
        component={RecipeRecommendationPage}
        options={{ title: 'Anbefalte oppskrifter' }}
      />
      <Stack.Screen
        name="singleRecipe"
        component={SingleRecipePage}
        options={{ title: 'Oppskrift' }}
      />
    </Stack.Navigator>
  );
}
