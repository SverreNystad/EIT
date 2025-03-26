import React from 'react';
import { View, Text, FlatList, Pressable, useColorScheme, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
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
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  // Added this callback so the cards can animate to cart
  flyToCart?: (layout: LayoutRectangle, imageUri: string) => void;
}

export default function Section({
  title,
  data,
  isOfferSection = false,
  onSeeMore,
  productClick,
  handleScroll,
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
       <ScrollView
            horizontal // Make it horizontally scrollable
            onScroll={handleScroll} // Attach the scroll handler
            scrollEventThrottle={16} // How often to receive scroll events
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >

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
        </ScrollView>
    </View>
  );
}
