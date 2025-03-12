import React from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import { Product } from '@/types/kassal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const colorScheme = useColorScheme() as 'light' | 'dark'; // ✅ Ensure TypeScript recognizes 'light' | 'dark'
  const theme = getTheme(colorScheme); // ✅ Ensure theme selection is always valid

  return (
    <View style={{
      width: 150, 
      backgroundColor: theme.card, 
      borderRadius: 10, 
      padding: 10,
      marginRight: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 }
    }}>
      <Image 
        source={{ uri: product.image }} 
        style={{ width: '100%', height: 100, borderRadius: 10 }} 
      />
      <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: theme.text, marginTop: 5 }}>
        {product.name}
      </Text>
      <Text style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>
        {product.store?.name}
      </Text>
      <Text style={{ fontSize: 14, color: 'red', fontWeight: 'bold' }}>
        {product.current_price} kr
      </Text>
    </View>
  );
}