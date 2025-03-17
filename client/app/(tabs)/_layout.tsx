import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = getTheme(colorScheme); 

  return (
    <Tabs
      screenOptions={{
        
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background, 
          borderTopColor: theme.card, 
          height: 60,
          paddingBottom: Platform.OS === 'ios' ? 10 : 5,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hjem',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Shopping List Tab */}
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: 'Handleliste',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.bullet" color={color} />
          ),
        }}
      />

      {/* Recipes Tab */}
      <Tabs.Screen 
        name="recipes"
        options={{
          title: 'Oppskrifter',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}