import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  LayoutRectangle,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Product, Sale } from '@/types/kassal';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';

interface OfferCardProps {
  product: Product;
  onPressProduct?: () => void;
  flyToCart?: (layout: LayoutRectangle, imageUri: string) => void;
}

export default function OfferCard({
  product,
  onPressProduct,
  flyToCart,
}: OfferCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] || Colors.light;
  const { addToCart } = useCart();
  const [cardLayout, setCardLayout] = useState<LayoutRectangle | null>(null);

  const handleLayout = (e: any) => {
    setCardLayout(e.nativeEvent.layout);
  };

  const handleAddPress = () => {
    addToCart(product);
    if (flyToCart && cardLayout) flyToCart(cardLayout, product.image);
  };


  // …inside OfferCard…

// Helper to render sale vs regular price
const renderPrice = () => {
  const sale = product.sale;
  const base = product.current_price.toFixed(2) + ' kr';

  if (!sale) {
    return (
      <Text style={{ fontSize: 16, color: theme.text, fontWeight: 'bold' }}>
        {base}
      </Text>
    );
  }

  // price sale
  if (sale.type === 'price' && sale.price != null) {
    return (
      <View>
        <Text
          style={{
            fontSize: 13,
            textDecorationLine: 'line-through',
            color: theme.text,
            opacity: 0.5,
          }}
        >
          {base}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#D72638',
            fontWeight: 'bold',
          }}
        >
          {sale.price.toFixed(2)} kr
        </Text>
      </View>
    );
  }

  // percentage sale
  if (
    sale.type === 'percentage' &&
    sale.discount_percentage != null
  ) {
    const discounted =
      product.current_price * (1 - sale.discount_percentage / 100);
    return (
      <View>
        <Text
          style={{
            fontSize: 13,
            textDecorationLine: 'line-through',
            color: theme.text,
            opacity: 0.5,
          }}
        >
          {base}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#D72638',
            fontWeight: 'bold',
          }}
        >
          {discounted.toFixed(2)} kr (-{sale.discount_percentage}%)
        </Text>
      </View>
    );
  }

  // n-for-price sale
  if (
    sale.type === 'n_for_price' &&
    sale.n != null &&
    sale.total_price != null
  ) {
    const unitPrice = (sale.total_price / sale.n).toFixed(2);
    return (
      <View>
        <Text
          style={{
            fontSize: 13,
            textDecorationLine: 'line-through',
            color: theme.text,
            opacity: 0.5,
          }}
        >
          {base}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#D72638',
            fontWeight: 'bold',
          }}
        >
          {sale.n} for {sale.total_price.toFixed(2)} kr{' '}
          <Text style={{ fontSize: 12, color: theme.text }}>
            ({unitPrice} kr each)
          </Text>
        </Text>
      </View>
    );
  }

  // fallback to base
  return (
    <Text style={{ fontSize: 16, color: theme.text, fontWeight: 'bold' }}>
      {base}
    </Text>
  );
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
        style={{
          width: '100%',
          height: 140,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        resizeMode="cover"
      />

      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontSize: 15, fontWeight: '600', color: theme.text }}
        >
          {product.name}
        </Text>
        <Text style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>
          {product.store?.name}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <View>{renderPrice()}</View>

          <TouchableOpacity
            onPress={handleAddPress}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 18,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
