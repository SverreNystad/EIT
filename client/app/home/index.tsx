import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product, PhysicalStore } from '../../types/kassal';
import { getProducts, getPhysicalStores } from '../../services/api';
import ProductCard from "../../components/ui/ProductCard";
import { useTheme } from '@react-navigation/native';
//import DealCard from "../../components/ui/DealCard";

// Define the correct navigation structure for the home stack
type HomeStackParamList = {
  Home: undefined;
  Products: undefined;
  Deals: undefined;
};


// Define the navigation prop type for the stack
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const { colors } = useTheme(); // Get current theme colors
  const [stores, setStores] = useState<PhysicalStore[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts({ size: 10 });
        setProducts(productsData.data);
        
        const storesData = await getPhysicalStores({ size: 5 });
        setStores(storesData.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Laster inn data...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tilbud for deg</Text>
        <Button mode="text" onPress={() => navigation.navigate('Deals')}>
          Se alle tilbud
        </Button>
      </View>
      
      
      <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Alle matvarer</Text>
        <Button mode="text" onPress={() => navigation.navigate('Products')}>
          Se alle matvarer
        </Button>
      </View>
      <View style={styles.sectionContainer}>
        {products.length > 0 ? (
          <FlatList
            horizontal
            data={products}
            renderItem={({ item }) => <ProductCard product={item} horizontal />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={[styles.emptyText, { color: colors.text }]}>Ingen produkter tilgjengelig.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  divider: {
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default HomeScreen;
