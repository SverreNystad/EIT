import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function ProfileScreen() {
    // Get the current theme colors from React Navigation.
      const { colors } = useTheme();
    
      return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>
            Hello, this is the profil Screen!
          </Text>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
      },
    });
    