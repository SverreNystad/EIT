import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { getTheme } from '@/constants/Colors';
import { getProducts } from '@/services/api'; 
import SavingsBox from '@/components/ui/SavingsBox';
import Section from '@/components/ui/Section';
import { Product, ProductsResponse } from '@/types/kassal';

// Define navigation stack types
type HomeStackParamList = {
  hjem: undefined;
  tilbud: undefined;
  produkter: undefined;
  produkt: { product: Product };
};

// Navigation typing
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'hjem'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>(); 
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = getTheme(colorScheme);

  const fadeAnim = useState(new Animated.Value(0))[0];

  // React Query: fetch products
  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ProductsResponse>({
    queryKey: ['products', 10], // <- unique key to cache by
    queryFn: () => getProducts({ size: 10 }),
  });

  // Destructure to get your array of products
  const products = productsResponse?.data ?? [];

  // Fake savings data (Replace with real API data if available)
  const co2Saved = 12.3;
  const moneySaved = 320;

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Navigate to product detail screen
  const handlePressProduct = (product: Product) => {
    navigation.navigate('produkt', { product });
  };

  // Handle potential error
  if (isError) {
    console.error('Failed to load data:', error);
    // You could also render an error component or message here
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <Animated.View style={{ opacity: fadeAnim, marginTop: 70 }}>
          <SavingsBox co2Saved={co2Saved} moneySaved={moneySaved} />
        </Animated.View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <Section
              title="Tilbud for deg"
              data={products.slice(0, 4)}
              isOfferSection
              onSeeMore={() => navigation.navigate('tilbud')}
              productClick={handlePressProduct}
            />

            <Section
              title="Alle matvarer"
              data={products.slice(0, 4)}
              onSeeMore={() => navigation.navigate('produkter')}
              productClick={handlePressProduct}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}
