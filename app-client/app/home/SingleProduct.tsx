// SingleProduct.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { getTheme } from '@/constants/Colors';
import { Product } from '@/types/kassal';
import PriceHistoryChart from '@/components/PriceHistoryChart'; // <-- Import the chart

type HomeStackParamList = {
  singleProduct: { product: Product };
};

type SingleProductRouteProp = RouteProp<HomeStackParamList, 'singleProduct'>;

const TABS = [
  'Oversikt',
  'Pris historikk',
  'Ingredienser og allergener',
  'Næringsinnhold',
  'Butikkinfo',
];

const { width } = Dimensions.get('window');

export default function SingleProduct() {
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  const route = useRoute<SingleProductRouteProp>();
  const { product } = route.params;

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  // Simple tab switching logic
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Oversikt':
        return (
          <View style={styles.tabContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {product.name}
            </Text>
            {product.brand && (
              <Text style={{ color: theme.text }}>Brand: {product.brand}</Text>
            )}
            {product.vendor && (
              <Text style={{ color: theme.text }}>Vendor: {product.vendor}</Text>
            )}
            {product.description && (
              <Text style={[styles.sectionBody, { color: theme.text }]}>
                {product.description}
              </Text>
            )}
            <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
              Weight: {product.weight} {product.weight_unit}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
              EAN: {product.ean || 'N/A'}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
              Created At: {new Date(product.created_at).toLocaleDateString()}
            </Text>
          </View>
        );
      case 'Pris historikk':
        return (
          <View style={styles.tabContainer}>
            {product.price_history && product.price_history.length > 0 ? (
              <>
                {/* Render the Chart */}
                <PriceHistoryChart data={product.price_history} />
              </>
            ) : (
              <Text style={[styles.sectionBody, { color: theme.text }]}>
                Ingen Pris historikk, tilgjengelig.
              </Text>
            )}
          </View>
        );
      case 'Ingredienser og allergener':
        return (
          <View style={styles.tabContainer}>
            <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
              Ingredienser:
            </Text>
            <Text style={[styles.sectionBody, { color: theme.text }]}>
              {product.ingredients || 'ingen ingredients tilgjengelig.'}
            </Text>
            {product.allergens && product.allergens.length > 0 && (
              <>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: theme.text, marginTop: 12 },
                  ]}
                >
                  Allergener:
                </Text>
                {product.allergens.map((allergen, idx) => (
                  <Text key={idx} style={{ color: theme.text }}>
                    • {allergen.display_name} ({allergen.contains})
                  </Text>
                ))}
              </>
            )}
          </View>
        );
      case 'Næringsinnhold':
        return (
          <View style={styles.tabContainer}>
            {product.nutrition && product.nutrition.length > 0 ? (
              product.nutrition.map((nut, idx) => (
                <Text key={idx} style={[styles.sectionBody, { color: theme.text }]}>
                  {nut.display_name}: {nut.amount}
                  {nut.unit}
                </Text>
              ))
            ) : (
              <Text style={[styles.sectionBody, { color: theme.text }]}>
                Ingen næringsinnhold tilgjengelig.
              </Text>
            )}
          </View>
        );
      case 'Butikkinfo':
        return (
          <View style={styles.tabContainer}>
            <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
              Store: {product.store?.name}
            </Text>
            <Text style={[styles.sectionBody, { color: theme.text }]}>
              URL: {product.store?.url}
            </Text>
            {product.store?.logo && (
              <Image
                source={{ uri: product.store.logo }}
                style={{
                  width: 100,
                  height: 40,
                  marginTop: 10,
                  resizeMode: 'contain',
                }}
              />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={[styles.heroTextTitle, { color: theme.background }]}>
            {product.name}
          </Text>
          <Text style={[styles.heroTextPrice, { color: theme.background }]}>
            {product.current_price} kr
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                {
                  borderBottomColor: isActive ? theme.primary : 'transparent',
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={{
                  color: isActive ? theme.text : theme.text,
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.tabContent}>{renderTabContent()}</ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    width: '100%',
    height: width * 0.6,
    backgroundColor: '#eee',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
  heroTextTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroTextPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    marginBottom: 4,
  },
});

