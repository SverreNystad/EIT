import React from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Product } from '@/types/kassal'; 

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const colorScheme = useColorScheme() ?? 'light'; 
  const theme = Colors[colorScheme] || Colors.light; 

  return (
    <View style={{
      width: 270, 
      backgroundColor: theme.card, 
      borderRadius: 16, 
      overflow: 'hidden',
      marginRight: 20,
      paddingBottom: 10,

      // ✅ iOS Shadow
      shadowColor: '#000', 
      shadowRadius: 6,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 4 },

    }}>
      <Image 
        source={{ uri: product.image }} 
        style={{ width: '100%', height: 160 }} 
        resizeMode="cover"
      />

      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        <Text 
          numberOfLines={1} // ✅ Ensures name fits in one line
          ellipsizeMode="tail" // ✅ Truncates with "..."
          style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}
        >
          {product.name}
        </Text>
        <Text style={{ fontSize: 13, color: theme.text, opacity: 0.7 }}>
          {product.store?.name}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.accent, marginTop: 6 }}>
          {product.current_price} kr
        </Text>
      </View>
    </View>
  );
}
