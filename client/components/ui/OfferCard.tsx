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
  const { addToCart, removeFromCart, cart } = useCart();
  const cartItem = cart.find((item) => item.product.id.toString() === product.id.toString());
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <View style={{
      width: 230, 
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
      {/* Product Image */}
      <Image 
        source={{ uri: product.image }} 
        style={{ width: '100%', height: 140, borderTopLeftRadius: 16, borderTopRightRadius: 16 }} 
        resizeMode="cover"
      />

      {/* Product Details */}
      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>
          {product.store?.name}
        </Text>

        {/* Price & Add-to-Cart Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <View>
            <Text style={{ fontSize: 13, textDecorationLine: 'line-through', color: theme.text, opacity: 0.5 }}>
              199 kr
            </Text>
            <Text style={{ fontSize: 16, color: '#D72638', fontWeight: 'bold' }}>
              {product.current_price} kr
            </Text>
          </View>

          {/* Add/Remove Quantity Section */}
          {quantity === 0 ? (
            <TouchableOpacity 
              onPress={() => addToCart(product)} 
              style={{ 
                backgroundColor: theme.primary, 
                borderRadius: 18,
                width: 30, height: 30, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <AntDesign name="plus" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              borderWidth: 2, 
              borderColor: theme.primary, 
              borderRadius: 10, 
              paddingHorizontal: 10, 
              paddingVertical: 4,
            }}>
              <TouchableOpacity onPress={() => removeFromCart(product.id.toString())}>
                <AntDesign name="minus" size={19} color={theme.primary} />
              </TouchableOpacity>

              <Text style={{ fontSize: 13, fontWeight: 'bold', color: theme.primary, marginHorizontal: 12 }}>
                {quantity}
              </Text>

              <TouchableOpacity onPress={() => addToCart(product)}>
                <AntDesign name="plus" size={19} color={theme.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
