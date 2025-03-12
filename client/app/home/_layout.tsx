import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import HomeScreen from './index';
import DealsScreen from './deals';
import ProductScreen from './products';
import SingleProduct from './SingleProduct';

const Stack = createStackNavigator();

export default function HomeStackLayout() {
  const colorScheme = useColorScheme() ?? 'light';
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
        name="home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="deals" 
        component={DealsScreen} 
        options={{ title: 'Tilbud' }} 
      />
      <Stack.Screen 
        name="products" 
        component={ProductScreen} 
        options={{ title: 'Alle matvarer' }} 
      />

      {/* New route for a single product view */}
      <Stack.Screen
        name="singleProduct"
        component={SingleProduct}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}
