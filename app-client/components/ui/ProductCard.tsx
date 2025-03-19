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

interface ProductCardProps {
  product: Product;
  onPressProduct?: () => void;
  flyToCart?: (layout: LayoutRectangle, imageUri: string) => void;
}

export default function ProductCard({ product, onPressProduct, flyToCart }: ProductCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] || Colors.light;
  const { addToCart } = useCart();

  const [cardLayout, setCardLayout] = useState<LayoutRectangle | null>(null);

  const handleLayout = (e: any) => {
    setCardLayout(e.nativeEvent.layout);
  };

  const handleAddPress = () => {
    addToCart(product);
    if (flyToCart && cardLayout) {
      flyToCart(cardLayout, product.image);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressProduct}
      onLayout={handleLayout}
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
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.accent }}>
            {product.current_price} kr
          </Text>

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
