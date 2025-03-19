import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  useColorScheme, 
  LayoutRectangle 
} from 'react-native';
import Colors from '@/constants/Colors';
import { Product } from '@/types/kassal';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';

interface OfferCardProps {
  product: Product;
  onPressProduct?: () => void; // if needed
  flyToCart?: (layout: LayoutRectangle, imageUri: string) => void;
}

export default function OfferCard({ product, onPressProduct, flyToCart }: OfferCardProps) {
  const colorScheme = useColorScheme() ?? 'light'; 
  const theme = Colors[colorScheme] || Colors.light;
  const { addToCart } = useCart();

  const [cardLayout, setCardLayout] = useState<LayoutRectangle | null>(null);

  // Measure card position
  const handleLayout = (e: any) => {
    setCardLayout(e.nativeEvent.layout);
  };

  const handleAddPress = () => {
    // 1) Add to cart
    addToCart(product);

    // 2) Trigger flyToCart if we have it
    if (flyToCart && cardLayout) {
      flyToCart(cardLayout, product.image);
    }
  };

  return (
    <TouchableOpacity
      onLayout={handleLayout}
      onPress={onPressProduct}
      style={{
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
      }}
    >
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
          <View>
            <Text style={{ fontSize: 13, textDecorationLine: 'line-through', color: theme.text, opacity: 0.5 }}>
              199 kr
            </Text>
            <Text style={{ fontSize: 16, color: '#D72638', fontWeight: 'bold' }}>
              {product.current_price} kr
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleAddPress}
            style={{ 
              backgroundColor: theme.primary, 
              borderRadius: 18,
              width: 30, 
              height: 30, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
