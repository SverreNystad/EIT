import React from 'react';
import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider, Theme } from '@react-navigation/native';
import Colors from '../constants/Colors';

// Create a custom navigation theme with required properties:
function useCustomTheme(colorScheme: 'light' | 'dark'): Theme {
  return {
    dark: colorScheme === 'dark',
    colors: {
      primary: Colors[colorScheme].tint,
      background: Colors[colorScheme].background,
      card: Colors[colorScheme].background, // Used for headers, tab bars, etc.
      text: Colors[colorScheme].text,
      border: '#000000',
      notification: Colors[colorScheme].tint,
    },
    // fonts
    fonts: {
      regular: { fontFamily: 'System', fontWeight: 'normal' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: 'bold' },
      heavy: { fontFamily: 'System', fontWeight: '700' },
    },
  };
}

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = useCustomTheme(colorScheme);

  return (
    <ThemeProvider value={theme}>
      <Slot />
    </ThemeProvider>
  );
}
