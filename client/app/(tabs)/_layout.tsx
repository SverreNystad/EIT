import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import {IconSymbol} from '@/components/ui/IconSymbol';
export default function TabLayout() {
  
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      // screenOptions applies the following settings to every tab in the navigator
      screenOptions={{
        // Set the active tint color based on the current color scheme:
        tabBarActiveTintColor: Colors[colorScheme].iconActive,
        headerShown: false,
        tabBarStyle: Platform.select({
          // For iOS, we position the tab bar absolutely
          ios: { position: 'absolute' },
          default: {},
        }),
        
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
