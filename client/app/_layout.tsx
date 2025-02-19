import React from 'react';
import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider, Theme } from '@react-navigation/native'; // detects if the device is in 'light' or 'dark' mode.
import Colors from '../constants/Colors';

/**
 * Custom hook to create a theme object for React Navigation.
 * @param colorScheme - The current color scheme ('light' or 'dark').
 * @returns - A theme object with the properties React Navigation expects.
 */
function useCustomTheme(colorScheme: 'light' | 'dark'): Theme {
  return {
    // Set the "dark" flag to true if the color scheme is 'dark'.
    dark: colorScheme === 'dark',
    // Define color palette for our navigation components
    colors: {
      background: Colors[colorScheme].background,
      text: Colors[colorScheme].text,
      primary: Colors[colorScheme].iconActive,
      card: Colors[colorScheme].background,
      border: '#000000',
      notification: Colors[colorScheme].iconActive,
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

/** RootLayout wraps the entire app in a ThemeProvider */
export default function RootLayout() {
  // Get the current device color scheme ('light' or 'dark'); default to 'light'.
  const colorScheme = useColorScheme() ?? 'light';
  // Build our custom theme
  const theme = useCustomTheme(colorScheme);

  return (
    // Provide the custom theme to all nested components.
    <ThemeProvider value={theme}>
      <Slot />
    </ThemeProvider>
  );
}
