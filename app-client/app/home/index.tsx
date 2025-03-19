import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, ScrollView, Animated, Easing, LayoutRectangle, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import { getProducts } from '@/services/api'; 
import SavingsBox from '@/components/ui/SavingsBox';
import Section from '@/components/ui/Section';
import { Product, ProductsResponse } from '@/types/kassal';

// Suppose we measured the cart icon or have a placeholder
const CART_ICON_POSITION = { x: 125, y: 900 };

// Navigation stack types
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

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fake savings data (Replace later with real API call)
  const co2Saved = 12.3;
  const moneySaved = 320;

  // Animated overlay states
  const animatedPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  // We store whether it's an offer animation or not
  const [isOfferAnimation, setIsOfferAnimation] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productsData: ProductsResponse = await getProducts({ size: 10 });
        setProducts(productsData.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  // Depending on isOfferAnimation, we change the overlay's initial left/top
  // so each card type starts from a different point.
  // For example:
  // Offer items: left = 50, top = 300
  // Product items: left = 100, top = 350
  // (Feel free to adjust these as needed)
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

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <Section 
              title="Tilbud for deg" 
              data={products.slice(0, 4)} 
              isOfferSection
              onSeeMore={() => navigation.navigate('tilbud')} 
              productClick={handlePressProduct}
              // Pass down the flyToCart function
              flyToCart={(
                layout: LayoutRectangle,
                imageUri: string
              ) => flyToCart(layout, imageUri, true)} // isOffer = true
            />

            <Section 
              title="Alle matvarer" 
              data={products.slice(0, 4)} 
              onSeeMore={() => navigation.navigate('produkter')} 
              productClick={handlePressProduct}
              // Pass down the flyToCart function
              flyToCart={(
                layout: LayoutRectangle,
                imageUri: string
              ) => flyToCart(layout, imageUri, false)} // isOffer = false
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}
