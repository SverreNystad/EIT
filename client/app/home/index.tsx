import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
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

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fake savings data (Replace later with real API call)
  const co2Saved = 12.3;
  const moneySaved = 320;

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
  }, []);

  const handlePressProduct = (product: Product) => {
    navigation.navigate('produkt', { product });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
