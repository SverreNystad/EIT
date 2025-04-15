// ShoppingListTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import Colors from '@/constants/Colors';
import { useCart } from '@/context/ShoppingListContext';
import { getPhysicalStores } from '../../services/api';
import { useLocationContext } from '@/context/LocationContext';
import ShopsMap from '@/components/ShopMap';
import { PhysicalStore } from '@/types/kassal';

import ReminderModal from '@/components/ui/ReminderModal';
import PurchaseModal from '@/components/ui/PurchaseModal';
import { useSavings } from '@/context/SavingsContext';

export default function ShoppingListTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] || Colors.light;
  const { cart, addToCart, removeFromCart, removeAllFromCart, clearCart } = useCart();
  const { updateSavings } = useSavings();
  const { location } = useLocationContext();
  const isFocused = useIsFocused();

  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [fetchedStores, setFetchedStores] = useState<PhysicalStore[]>([]);

  // Modal flags
  const [reminderVisible, setReminderVisible] = useState<boolean>(true);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState<boolean>(false);

  // New state: control map visibility
  const [showMap, setShowMap] = useState<boolean>(false);

  // Reset the reminder each time the tab is focused
  useEffect(() => {
    if (isFocused) {
      setReminderVisible(true);
    }
  }, [isFocused]);

  // Fetch physical stores when cart or location updates
  useEffect(() => {
    async function fetchStoresForCart() {
      try {
        if (!location) return;

        const uniqueStoreCodes = Array.from(
          new Set(cart.map((item) => item.product.store?.code))
        ).filter(Boolean) as string[];

        if (uniqueStoreCodes.length === 0) {
          setFetchedStores([]);
          return;
        }

        const kmRadius = 20;
        let allStores: PhysicalStore[] = [];

        for (const code of uniqueStoreCodes) {
          const response = await getPhysicalStores({
            group: code,
            lat: location.lat,
            lng: location.lng,
            km: kmRadius,
          });
          if (response.data && response.data.length > 0) {
            allStores.push(...response.data);
          }
        }

        const uniqueMap = new Map<number, PhysicalStore>();
        allStores.forEach((store) => uniqueMap.set(store.id, store));
        setFetchedStores(Array.from(uniqueMap.values()));
      } catch (error) {
        console.error('Failed to fetch physical stores:', error);
      }
    }

    if (cart.length > 0) {
      fetchStoresForCart();
    } else {
      setFetchedStores([]);
    }
  }, [cart, location]);

  // Group cart items by store for display
  const groupedCart = cart.reduce((acc, item) => {
    const storeCode = item.product.store?.code || 'unknown_code';
    const storeName = item.product.store?.name || 'Ukjent Butikk';

    if (!acc[storeCode]) {
      acc[storeCode] = { storeName, items: [] };
    }
    acc[storeCode].items.push(item);
    return acc;
  }, {} as Record<string, { storeName: string; items: typeof cart }>);

  // Toggle item completed state
  const toggleItem = (productId: string) => {
    setCompletedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // "Kjøp" button handler: require at least one checked item
  const handlePurchase = () => {
    if (completedItems.length === 0) {
      Alert.alert(
        'Ingen produkter avkrysset',
        'Vennligst kryss av minst ett produkt før du foretar kjøp.'
      );
      return;
    }
    setPurchaseModalVisible(true);
  };

  // On purchase confirmation, calculate savings and remove checked items
  const onConfirmPurchase = (rememberedBag: boolean, bagCount: number) => {
    setPurchaseModalVisible(false);
    const SAVINGS_PER_ITEM = 5; // kr saved per completed item
    const BONUS_MONEY_PER_BAG = 6; // kr saved per bag
    const BONUS_CO2_PER_BAG = 1.58; // kg CO₂ saved per bag

    const baseMoney = completedItems.length * SAVINGS_PER_ITEM;
    const bonusMoney = rememberedBag ? bagCount * BONUS_MONEY_PER_BAG : 0;
    const totalMoneySaved = baseMoney + bonusMoney;
    const totalCO2Saved = rememberedBag ? bagCount * BONUS_CO2_PER_BAG : 0;

    updateSavings(totalMoneySaved, totalCO2Saved);

    // Remove the checked items from the cart
    completedItems.forEach((productId) => {
      removeAllFromCart(productId);
    });
    setCompletedItems([]);
  };

  // Render each group (by store)
  const renderGroup = ({ item }: { item: [string, { storeName: string; items: typeof cart }] }) => {
    const [storeCode, { storeName, items }] = item;
    return (
      <View key={storeCode} style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.text,
            marginBottom: 8,
          }}
        >
          {storeName}
        </Text>
        {items.map((cartItem) => {
          const totalPrice = (cartItem.product.current_price * cartItem.quantity).toFixed(2);
          const productIdStr = cartItem.product.id.toString();

          return (
            <View
              key={productIdStr}
              style={{
                backgroundColor: theme.card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => toggleItem(productIdStr)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: completedItems.includes(productIdStr) ? '#4CAF50' : 'gray',
                      backgroundColor: completedItems.includes(productIdStr) ? '#A5D6A7' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    {completedItems.includes(productIdStr) && (
                      <AntDesign name="check" size={18} color="white" />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      color: theme.text,
                      fontSize: 16,
                      fontWeight: 'bold',
                      textDecorationLine: completedItems.includes(productIdStr) ? 'line-through' : 'none',
                    }}
                  >
                    {cartItem.product.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeAllFromCart(productIdStr)} style={{ padding: 8 }}>
                  <AntDesign name="delete" size={22} color="red" />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: theme.primary,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginLeft: 40,
                  }}
                >
                  <TouchableOpacity onPress={() => removeFromCart(productIdStr)}>
                    <AntDesign name="minus" size={19} color={theme.primary} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: theme.primary, marginHorizontal: 12 }}>
                    {cartItem.quantity}
                  </Text>
                  <TouchableOpacity onPress={() => addToCart(cartItem.product)}>
                    <AntDesign name="plus" size={19} color={theme.primary} />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>
                    {totalPrice} kr
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 13, opacity: 0.6, textAlign: 'right' }}>
                    ({cartItem.product.current_price} kr/stk)
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 40, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>Handleliste</Text>
      <ReminderModal visible={reminderVisible} onDismiss={() => setReminderVisible(false)} />
      
      {/* Scrollable list container */}
      <View style={{ flex: 1 }}>
        {Object.keys(groupedCart).length === 0 ? (
          <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
            Ingen produkter i handlelisten.
          </Text>
        ) : (
          <FlatList
            data={Object.entries(groupedCart)}
            keyExtractor={([storeCode]) => storeCode}
            renderItem={renderGroup}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
      
      {/* Bottom fixed controls */}
      <View style={{ marginVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          {cart.length > 0 && (
            <TouchableOpacity
              onPress={handlePurchase}
              style={{
                backgroundColor: '#4CAF50',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                flex: 1,
                marginRight: 10,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Kjøp</Text>
            </TouchableOpacity>
          )}
          {cart.length > 0 && (
            <TouchableOpacity
              onPress={clearCart}
              style={{
                backgroundColor: '#D72638',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Tøm Handleliste</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setShowMap((prev) => !prev)}
          style={{
            backgroundColor: '#007bff',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <AntDesign name="enviromento" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            {showMap ? 'Skjul butikker' : 'Finn butikker nær deg'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Fixed map area */}
      {showMap && (
        <View style={{ height: 250, marginHorizontal: 16, marginBottom: 16 }}>
          <ShopsMap stores={fetchedStores} />
        </View>
      )}
      
      {/* Purchase modal for bag information */}
      <PurchaseModal
        visible={purchaseModalVisible}
        onConfirm={onConfirmPurchase}
        onCancel={() => setPurchaseModalVisible(false)}
      />
    </View>
  );
}
