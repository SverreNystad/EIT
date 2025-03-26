import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Animated,
  Easing,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // React Query: fetch products with pagination parameters
  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ProductsResponse>({
    queryKey: ['products', currentPage, pageSize],
    queryFn: () => getProducts({ page: currentPage, size: pageSize }),
  });

  // Destructure products and meta data from the response
  const products = productsResponse?.data ?? [];
  const meta = productsResponse?.meta;

  // Fake savings data (replace with real API data if available)
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
    // Optionally, you could render an error message here.
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // If the user has scrolled horizontally close to the end
    // Adjust the threshold as needed (e.g. 50 pixels)
    if (
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 50
    ) {
        setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
              data={products}
              isOfferSection
              onSeeMore={() => navigation.navigate('tilbud')}
              productClick={handlePressProduct}
              handleScroll={handleScroll}
            />
            <Section
              title="Alle matvarer"
              data={products}
              onSeeMore={() => navigation.navigate('produkter')}
              productClick={handlePressProduct}
              handleScroll={handleScroll}
            />
            {meta && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 20,
                }}
              >
              </View>
            )}
          </>
        )}
    </View>
  );
}
