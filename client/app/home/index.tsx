import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useColorScheme } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import { getProducts } from '@/services/api'; 
import SavingsBox from '@/components/ui/SavingsBox';
import Section from '@/components/ui/Section';
import { Product, ProductsResponse } from '@/types/kassal';

// Define the stack param list
type HomeStackParamList = {
  home: undefined;
  deals: undefined;
  products: undefined;
};

// Use StackNavigationProp for correct typing
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>(); 
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = getTheme(colorScheme);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fake savings data (Replace with real API data later)
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
    >
      {/* ✅ Redesigned SavingsBox */}
      <View style={{ marginTop: 50 }}>  
        <SavingsBox co2Saved={12.3} moneySaved={320} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* ✅ Uses OfferCard.tsx for "Tilbud for deg" */}
          <Section 
            title="Tilbud for deg" 
            data={products.slice(0, 4)} 
            isOfferSection 
            onSeeMore={() => navigation.navigate('deals')} 
          />

          {/* ✅ Uses ProductCard.tsx for "Alle matvarer" */}
          <Section 
            title="Alle matvarer" 
            data={products.slice(0, 4)} 
            onSeeMore={() => navigation.navigate('products')} 
          />
        </>
      )}
    </ScrollView>
  </View>
  );
}
