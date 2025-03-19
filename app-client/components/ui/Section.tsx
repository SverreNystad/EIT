import React from 'react';
import { View, Text, FlatList, Pressable, useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import ProductCard from '@/components/ui/ProductCard';
import OfferCard from '@/components/ui/OfferCard';
import { Product } from '@/types/kassal';
import { LayoutRectangle } from 'react-native';

interface SectionProps {
  title: string;
  data: Product[];
  isOfferSection?: boolean;
  onSeeMore: () => void;
  productClick: (product: Product) => void;

  // Added this callback so the cards can animate to cart
  flyToCart?: (layout: LayoutRectangle, imageUri: string) => void;
}

export default function Section({
  title,
  data,
  isOfferSection = false,
  onSeeMore,
  productClick,
  flyToCart
}: SectionProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={{ marginBottom: 30 }}>
      {/* Header Row: Title + See More */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>
          {title}
        </Text>
        <Pressable onPress={onSeeMore}>
          <Text style={{ fontSize: 16, color: theme.primary }}>
            Se mer →
          </Text>
        </Pressable>
      </View>

      {/* Horizontal List of Cards */}
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          // For each product, decide if we render an OfferCard or ProductCard
          if (isOfferSection) {
            // OfferCard has a prop for pressing the product, and for the fly-to-cart
            return (
              <OfferCard
                product={item}
                onPressProduct={() => productClick(item)}
                flyToCart={flyToCart}
              />
            );
          } else {
            return (
              <ProductCard
                product={item}
                onPressProduct={() => productClick(item)}
                flyToCart={flyToCart}
              />
            );
          }
        }}
      />
    </View>
  );
}
