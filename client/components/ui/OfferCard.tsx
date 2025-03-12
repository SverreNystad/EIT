import React from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import { Product } from '@/types/kassal';

interface OfferCardProps {
  product: Product;
}

export default function OfferCard({ product }: OfferCardProps) {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = getTheme(colorScheme);

  return (
    <View style={{
      width: 160,
      backgroundColor: theme.card,
      borderRadius: 10,
      padding: 12,
      marginRight: 14,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    }}>
      <Image 
        source={{ uri: product.image }} 
        style={{ width: '100%', height: 100, borderRadius: 8 }} 
      />
      <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginTop: 6 }}>
        {product.name}
      </Text>
      <Text style={{ fontSize: 12, color: theme.text, opacity: 0.6, marginTop: 2 }}>{product.store?.name}</Text>
      
      {/* Prices */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Text style={{ fontSize: 13, textDecorationLine: 'line-through', color: theme.text, opacity: 0.5 }}>
          19.56 kr
        </Text>
        <Text style={{ fontSize: 16, color: 'red', fontWeight: '600', marginLeft: 8 }}>
          {product.current_price} kr
        </Text>
      </View>
    </View>
  );
}
