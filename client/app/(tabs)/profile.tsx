import React, { useContext } from 'react';
import { View, Text, StyleSheet,useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        <Text style={{ color: Colors[colorScheme].text }}>
          Hello, this is the Profile Screen!
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