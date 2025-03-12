import React from 'react';
import { View, Text, Button, Linking, useColorScheme } from 'react-native';
import Head from 'expo-router/head';
import { getTheme } from '../constants/Colors'; // ✅ Use theme helper

export default function WebApp() {
  const colorScheme = useColorScheme(); // Detects system theme
  const theme = getTheme(colorScheme); // ✅ Always returns a valid theme

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.background,
      }}
    >
      <Head>
        <title>Download Our Food App</title>
      </Head>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: theme.text }}>
        Welcome to Our Food App!
      </Text>

      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20, color: theme.text }}>
        Download our app to explore the best food deals and products.
      </Text>

      <Button 
        title="Download for iOS" 
        onPress={() => Linking.openURL('https://apps.apple.com')} 
        color={theme.primary}
      />

      <View style={{ marginTop: 10 }}>
        <Button 
          title="Download for Android" 
          onPress={() => Linking.openURL('https://play.google.com')} 
        />
      </View>
    </View>
  );
}