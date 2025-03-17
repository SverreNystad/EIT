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
        name="hjem" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="tilbud" 
        component={DealsScreen} 
        options={{ title: 'Tilbud for deg', headerBackTitle: 'Tilbake', headerShown: true }} 
      />
      <Stack.Screen 
        name="produkter" 
        component={ProductScreen} 
        options={{ title: 'Alle matvarer', headerBackTitle: 'Tilbake', headerShown: true }} 
      />
      <Stack.Screen
        name="produkt"
        component={SingleProduct}
        options={{ title: 'Produkt detaljer', headerBackTitle: 'Tilbake', headerShown: true }}
      />
    </Stack.Navigator>
  );
}
