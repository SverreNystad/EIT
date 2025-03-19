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
        backgroundColor: theme.card,
        padding: 20,
        borderRadius: 16,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
      }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
          Hei, Andrine!
        </Text>
  
        <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',  
            width: '100%', 
            flexWrap: 'wrap', 
            }}>
            {/* CO₂ Savings */}
            <View style={{ alignItems: 'center', flex: 1 }}>
                <MaterialIcons name="cloud" size={24} color={theme.text} />
                <Text style={{ fontSize: 15, color: theme.text, marginTop: 4 }}>CO₂ spart</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.accent, marginTop: 4 }}>
                {co2Saved} kg
                </Text>
            </View>

            {/* Money Savings */}
            <View style={{ alignItems: 'center', flex: 1 }}>
                <MaterialIcons name="attach-money" size={24} color={theme.text} />
                <Text style={{ fontSize: 15, color: theme.text, marginTop: 4 }}>Penger spart</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.accent, marginTop: 4 }}>
                {moneySaved} kr
                </Text>
            </View>
            </View>
      </View>
    );
  }