import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Animated,
  Easing,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  LayoutRectangle, // <-- For measuring item layouts
  Image,           // <-- For the animated Image
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';

import { getTheme } from '@/constants/Colors';
import { getProducts } from '@/services/api';
import SavingsBox from '@/components/ui/SavingsBox';
import Section from '@/components/ui/Section';
import { Product, ProductsResponse } from '@/types/kassal';

// Define a fixed cart icon position for the “fly” animation
const CART_ICON_POSITION = { x: 125, y: 900 };

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
  const animatedPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [isOfferAnimation, setIsOfferAnimation] = useState(false);

  // Pagination state 
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

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

  // “Fly to cart” animation logic from snippet #2
  const flyToCart = (layout: LayoutRectangle, imageUri: string, isOffer: boolean) => {
    setIsOfferAnimation(isOffer);
    setOverlayVisible(true);
    setOverlayImage(imageUri);

    // Set the initial position of the animated image to the tapped card
    animatedPosition.setValue({ x: layout.x, y: layout.y });
    animatedScale.setValue(1);

    // Animate to the cart icon
    Animated.parallel([
      Animated.timing(animatedPosition, {
        toValue: { x: CART_ICON_POSITION.x, y: CART_ICON_POSITION.y },
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 0.2,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Once animation finishes, hide the overlay
      setOverlayVisible(false);
      setOverlayImage(null);
    });
  };

  // Determine the overlay's absolute starting position
  // (can customize these to differentiate offer vs normal)
  const initialLeft = isOfferAnimation ? 100 : 100;
  const initialTop = isOfferAnimation ? 300 : 550;

  // Navigate to product detail screen
  const handlePressProduct = (product: Product) => {
    navigation.navigate('produkt', { product });
  };

  // Handle potential error
  if (isError) {
    console.error('Failed to load data:', error);
    // Optionally, you could render an error message here.
  }

  // Infinite scroll/pagination logic (horizontal example in Section)
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // If the user has scrolled close to the end (horizontally)
    if (
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 50
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Animated overlay for the fly-to-cart effect */}
      {overlayVisible && overlayImage && (
        <Animated.View
          style={{
            position: 'absolute',
            left: initialLeft,
            top: initialTop,
            transform: [
              { translateX: animatedPosition.x },
              { translateY: animatedPosition.y },
              { scale: animatedScale },
            ],
            zIndex: 999,
          }}
        >
          <Image
            source={{ uri: overlayImage }}
            style={{ width: 80, height: 80, borderRadius: 8 }}
          />
        </Animated.View>
      )}

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
              data={products}
              isOfferSection
              onSeeMore={() => navigation.navigate('tilbud')}
              productClick={handlePressProduct}
              handleScroll={handleScroll}
              flyToCart={(layout, imageUri) => flyToCart(layout, imageUri, true)}
            />
            <Section
              title="Alle matvarer"
              data={products}
              onSeeMore={() => navigation.navigate('produkter')}
              productClick={handlePressProduct}
              handleScroll={handleScroll}
              flyToCart={(layout, imageUri) => flyToCart(layout, imageUri, false)}
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
      </ScrollView>
    </View>
  );
}
