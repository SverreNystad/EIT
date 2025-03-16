import React from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Product } from '@/types/kassal';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] || Colors.light;
  const { addToCart, cart } = useCart();

  const cartItem = cart.find((item) => item.product.id.toString() === product.id.toString());
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <View style={{
      width: 220,
      backgroundColor: theme.card,
      borderRadius: 16,
      overflow: 'hidden',
      marginRight: 16,
      paddingBottom: 10,
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
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.accent }}>
            {product.current_price} kr
          </Text>

          {/* ✅ Add to Cart Button */}
          <TouchableOpacity 
            onPress={() => addToCart(product)} 
            style={{ backgroundColor: theme.primary, borderRadius: 20, padding: 6 }}
          >
            <AntDesign name="plus" size={18} color="white" />
          </TouchableOpacity>

          {/* ✅ Show quantity if added */}
          {quantity > 0 && (
            <View style={{
              backgroundColor: '#4CAF50',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 2,
              marginLeft: 8,
            }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                {quantity}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}