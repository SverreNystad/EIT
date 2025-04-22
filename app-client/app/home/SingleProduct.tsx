import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { TabView, TabBar } from 'react-native-tab-view';
import { getTheme } from '@/constants/Colors';
import { Product } from '@/types/kassal';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';

type HomeStackParamList = {
  singleProduct: { product: Product };
};
type SingleProductRouteProp = RouteProp<HomeStackParamList, 'singleProduct'>;
type Route = { key: string; title: string };

const { width } = Dimensions.get('window');

export default function SingleProduct() {
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);
  const layout = useWindowDimensions();

  const route = useRoute<SingleProductRouteProp>();
  const { product } = route.params;

  const { addToCart } = useCart();

  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'oversikt', title: 'Oversikt' },
    { key: 'prisHistorikk', title: 'Pris historikk' },
    { key: 'ingredienser', title: 'Ingredienser og allergener' },
    { key: 'naringsinnhold', title: 'Næringsinnhold' },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'oversikt':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.gridContainer}>
              {product.brand && (
                <View style={styles.gridItem}>
                  <Text style={styles.infoLabel}>Merke</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>
                    {product.brand}
                  </Text>
                </View>
              )}
              {product.vendor && (
                <View style={styles.gridItem}>
                  <Text style={styles.infoLabel}>Leverandør</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>
                    {product.vendor}
                  </Text>
                </View>
              )}
              {product.weight && (
                <View style={styles.gridItem}>
                  <Text style={styles.infoLabel}>Vekt</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>
                    {product.weight} {product.weight_unit}
                  </Text>
                </View>
              )}
              <View style={styles.gridItem}>
                <Text style={styles.infoLabel}>EAN</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {product.ean || 'N/A'}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.infoLabel}>Opprettet</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {new Date(product.created_at).toLocaleDateString('no-NO')}
                </Text>
              </View>
              {product.description && (
                <View style={styles.gridItemFull}>
                  <Text
                    style={[
                      styles.sectionBody,
                      { color: theme.text, marginTop: 8 },
                    ]}
                  >
                    {product.description}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        );
      case 'prisHistorikk':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.tabContainer}>
              {product.price_history && product.price_history.length > 0 ? (
                <PriceHistoryChart data={product.price_history} />
              ) : (
                <Text style={[styles.sectionBody, { color: theme.text }]}>Ingen pris historikk tilgjengelig.</Text>
              )}
            </View>
          </ScrollView>
        );
      case 'ingredienser':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.tabContainer}>
              <Text style={[styles.sectionSubtitle, { color: theme.text }]}>Ingredienser:</Text>
              <Text style={[styles.sectionBody, { color: theme.text }]}>
                {product.ingredients || 'Ingen ingredients tilgjengelig.'}
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
          </ScrollView>
        );
      case 'naringsinnhold':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.gridContainer}>
              {product.nutrition && product.nutrition.length > 0 ? (
                product.nutrition.map((nut, idx) => (
                  <View key={idx} style={styles.gridItem}>
                    <Text style={styles.infoLabel}>{nut.display_name}</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>    
                      {nut.amount}{nut.unit}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.gridItemFull}>
                  <Text style={[styles.sectionBody, { color: theme.text }]}>Ingen næringsinnhold tilgjengelig.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      style={{ backgroundColor: theme.background }}
      indicatorStyle={{ backgroundColor: theme.primary }}
      labelStyle={{ color: theme.text }}
      activeColor={theme.text}
      inactiveColor={theme.text}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>      
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.actionContainer}>
        <Text style={[styles.nameText, { color: theme.text }]}>   
          {product.name}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.text }]}>  
          {product.store?.name}
        </Text>

        <View style={styles.row}>
          <Text style={[styles.priceText, { color: theme.text }]}>  
            {product.current_price} kr
          </Text>
          <TouchableOpacity
            onPress={() => addToCart(product)}
            style={[styles.addButton, { backgroundColor: theme.primary }]}
          >
            <AntDesign name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { width: '100%', height: width * 0.6, backgroundColor: '#eee' },
  heroImage: { width: '100%', height: '100%' },
  actionContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  nameText: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontSize: 20, fontWeight: 'bold' },
  addButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tabContent: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  tabContainer: { marginBottom: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  gridItem: { width: '50%', paddingHorizontal: 8, marginBottom: 16 },
  gridItemFull: { width: '100%', paddingHorizontal: 8, marginBottom: 16 },
  sectionSubtitle: { fontSize: 16, fontWeight: '500', color: '#888', marginBottom: 6 },
  sectionBody: { fontSize: 14, marginBottom: 4, lineHeight: 20 },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '500' },
});