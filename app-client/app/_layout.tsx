import React from 'react';
import { Slot, Redirect, usePathname } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { ThemeProvider, Theme } from '@react-navigation/native';
import Colors from '../constants/Colors'; 
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '@/context/ShoppingListContext';
import { SavingsProvider } from '@/context/SavingsContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationProvider } from '@/context/LocationContext';

const queryClient = new QueryClient();


/**
 * Custom hook to create a theme object for React Navigation.
 */
function useCustomTheme(colorScheme: 'light' | 'dark'): Theme {
  return {
    dark: colorScheme === 'dark',
    colors: {
      background: Colors[colorScheme].background,
      text: Colors[colorScheme].text,
      primary: Colors[colorScheme].primary,
      card: Colors[colorScheme].background,
      border: colorScheme === 'dark' ? '#333' : '#ccc',
      notification: Colors[colorScheme].primary,
    },
    
    fonts: {
      regular: { fontFamily: 'System', fontWeight: 'normal' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: 'bold' },
      heavy: { fontFamily: 'System', fontWeight: '700' },
    },
  };
}

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light'; // Detect system theme
  const theme = useCustomTheme(colorScheme);
  const pathname = usePathname(); // Get current route

  // ensures web users stay on `/` and hide the header 
  if (Platform.OS === 'web' && pathname !== '/' && pathname !== '/index') {
    return <Redirect href="/" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SavingsProvider>
      <CartProvider> 
        <LocationProvider>
          <ThemeProvider value={theme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </LocationProvider>
      </CartProvider>
      </SavingsProvider>
    </QueryClientProvider>
  );
}