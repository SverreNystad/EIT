import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

interface SavingsBoxProps {
  co2Saved: number;
  moneySaved: number;
}

export default function SavingsBox({ co2Saved, moneySaved }: SavingsBoxProps) {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = getTheme(colorScheme);

  return (
    <View style={{
      backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#ead8c0', // ✅ Improved contrast
      padding: 20,
      borderRadius: 16,
      marginBottom: 30,
      alignItems: 'center',
      shadowColor: '#000',
      //shadowOpacity: colorScheme === 'dark' ? 0.6 : 0.3, 
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
        
      </Text>

      {/* ✅ Improved layout for better contrast */}
      <View style={{
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
        backgroundColor: colorScheme === 'dark' ? '2A2A2A#' : '#FFFFFF',
        borderRadius: 12,
        padding: 12,
      }}>
        {/* CO₂ Savings */}
        <View style={{ alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="cloud" size={24} color={theme.text} />
          <Text style={{ fontSize: 15, color: theme.text, marginTop: 4 }}>CO₂ spart</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4cbb17', marginTop: 6 }}>
            {co2Saved} kg
          </Text>
        </View>

        {/* Money Savings */}
        <View style={{ alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="attach-money" size={24} color={theme.text} />
          <Text style={{ fontSize: 15, color: theme.text, marginTop: 4 }}>Penger spart</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4cbb17', marginTop: 6 }}>
            {moneySaved} kr
          </Text>
        </View>
      </View>
    </View>
  );
}
