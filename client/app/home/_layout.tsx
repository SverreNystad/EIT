import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import HomeScreen from './index';
import DealsScreen from './deals';
import ProductScreen from './products';

const Stack = createStackNavigator();

export default function HomeStackLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      text: Colors.light.text,
      primary: Colors.light.iconActive,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      text: Colors.dark.text,
      primary: Colors.dark.iconActive,
    },
  };

  return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' 
              ? Colors.dark.background 
              : Colors.light.background,
          },
          headerTintColor: colorScheme === 'dark' 
            ? Colors.dark.text 
            : Colors.light.text,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Deals" 
          component={DealsScreen} 
          options={{ title: 'Tilbud' }} 
        />
        <Stack.Screen 
          name="Products" 
          component={ProductScreen} 
          options={{ title: 'Alle matvarer' }} 
        />
      </Stack.Navigator>
  );
}