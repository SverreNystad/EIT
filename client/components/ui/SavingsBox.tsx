import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';

interface SavingsBoxProps {
  co2Saved: number; // kg
  moneySaved: number; // kr
}

export default function SavingsBox({ co2Saved, moneySaved }: SavingsBoxProps) {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = getTheme(colorScheme);

  return (
    <View style={{
      backgroundColor: theme.primary,
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginBottom: 20,
      marginTop: 10, // Added spacing from the top
      alignItems: 'center',
      shadowColor: theme.text, 
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 }
    }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Spart</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 6 }}>
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '400' }}>CO₂ spart: <Text style={{ fontWeight: '600' }}>{co2Saved.toFixed(1)} kg</Text></Text>
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '400' }}>Penger spart: <Text style={{ fontWeight: '600' }}>{moneySaved.toFixed(0)} kr</Text></Text>
      </View>
    </View>
  );
}
