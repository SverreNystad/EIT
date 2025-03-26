import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Animated, Image, Easing, LayoutRectangle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';

import { getTheme } from '@/constants/Colors';
import { getProducts } from '@/services/api'; 
import SavingsBox from '@/components/ui/SavingsBox';
import Section from '@/components/ui/Section';
import { Product, ProductsResponse } from '@/types/kassal';

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
  // Animated overlay states
  const animatedPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  
  const [isOfferAnimation, setIsOfferAnimation] = useState(false);

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

  /**
   * Called by child cards (OfferCard or ProductCard) when user presses "+"
   * @param layout The card's layout rectangle (from onLayout)
   * @param imageUri The product image to animate
   * @param isOffer Whether the item is an offer (true) or not (false)
   */
  const flyToCart = (layout: LayoutRectangle, imageUri: string, isOffer: boolean) => {
    setIsOfferAnimation(isOffer);
    setOverlayVisible(true);
    setOverlayImage(imageUri);

    // Set starting position
    animatedPosition.setValue({ x: layout.x, y: layout.y });
    animatedScale.setValue(1);

    // Animate to cart
    Animated.parallel([
      Animated.timing(animatedPosition, {
        toValue: { x: CART_ICON_POSITION.x, y: CART_ICON_POSITION.y },
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(animatedScale, {
        toValue: 0.2,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start(() => {
      setOverlayVisible(false);
      setOverlayImage(null);
    });
  };


  // Handle potential error
  if (isError) {
    console.error('Failed to load data:', error);
    // You could also render an error component or message here
  }
  const initialLeft = isOfferAnimation ? 100 : 100;
  const initialTop = isOfferAnimation ? 300 : 550;


  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>

      {/* Animated overlay for the fly-to-cart */}
      {overlayVisible && overlayImage && (
        <Animated.View
          style={{
            position: 'absolute',
            // Different start points for offer vs product
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
              data={products.slice(0, 4)}
              isOfferSection
              onSeeMore={() => navigation.navigate('tilbud')}
              productClick={handlePressProduct}
              handleScroll={() => {}}
            />

            <Section
              title="Alle matvarer"
              data={products.slice(0, 4)}
              onSeeMore={() => navigation.navigate('produkter')}
              productClick={handlePressProduct}
              handleScroll={() => {}}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}