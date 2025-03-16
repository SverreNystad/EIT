import React from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Product } from '@/types/kassal';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';

interface OfferCardProps {
  product: Product;
}

export default function OfferCard({ product }: OfferCardProps) {
  const colorScheme = useColorScheme() ?? 'light'; 
  const theme = Colors[colorScheme] || Colors.light;
  const { addToCart } = useCart();

  return (
    <View style={{
      width: 220, 
      backgroundColor: theme.card, 
      borderRadius: 16, 
      overflow: 'hidden',
      marginRight: 16,
      paddingBottom: 10,

      // ✅ Shadow effect for better UI
      shadowColor: '#000', 
      shadowRadius: 8,
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    }}>
      <Image 
        source={{ uri: product.image }} 
        style={{ width: '100%', height: 140, borderTopLeftRadius: 16, borderTopRightRadius: 16 }} 
        resizeMode="cover"
      />

      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>
          {product.store?.name}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          {/* Original Price (Strikethrough) */}
          <Text style={{ fontSize: 13, textDecorationLine: 'line-through', color: theme.text, opacity: 0.5 }}>
            199 kr
          </Text>

          {/* Discounted Price */}
          <Text style={{ fontSize: 16, color: '#D72638', fontWeight: 'bold', marginLeft: 6 }}>
            {product.current_price} kr
          </Text>

          
          <TouchableOpacity 
            onPress={() => addToCart(product)} 
            style={{ backgroundColor: theme.primary, borderRadius: 20, padding: 6, marginLeft: 'auto' }}
          >
            <AntDesign name="plus" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}