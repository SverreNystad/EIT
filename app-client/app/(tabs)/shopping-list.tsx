import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { useCart } from '@/context/ShoppingListContext';
import { getPhysicalStores } from '../../services/api';
import { useLocationContext } from '@/context/LocationContext';
import ShopsMap from '@/components/ShopMap'; // or wherever your ShopsMap is exported

import { PhysicalStore } from '@/types/kassal'; // Adjust import path to your types

export default function ShoppingListTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] || Colors.light;

  const { cart, addToCart, removeFromCart, removeAllFromCart, clearCart } = useCart();
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const { location, errorMsg } = useLocationContext();

  // Collect all found stores here
  const [fetchedStores, setFetchedStores] = useState<PhysicalStore[]>([]);

  // Handle removing all instances of a single product
  const handleRemoveAllFromCart = (productId: string) => {
    removeAllFromCart(productId);
    setCompletedItems((prev) => prev.filter((id) => id !== productId));
  };


  // Toggle completed item check
  const toggleItem = (productId: string) => {
    setCompletedItems((prev) =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };


  // Whenever cart changes, fetch physical stores for each distinct store code
  useEffect(() => {
    async function fetchStoresForCart() {
      try {
        // If user location is not ready, skip
        if (!location) return;

        // Gather unique store codes from cart
        const uniqueStoreCodes = Array.from(
          new Set(cart.map((item) => item.product.store?.code))
        ).filter(Boolean) as string[];

        if (uniqueStoreCodes.length === 0) {
          setFetchedStores([]);
          return;
        }

        const kmRadius = 20;
        let allStores: PhysicalStore[] = [];

        // For each store chain "code," get up to 'kmRadius' away from user
        for (const code of uniqueStoreCodes) {
          const response = await getPhysicalStores({
            group: code,
            lat: location.lat,
            lng: location.lng,
            km: kmRadius,
          });
          // Merge the new stores into allStores
          if (response.data && response.data.length > 0) {
            allStores = [...allStores, ...response.data];
          }
        }

        // If you want to ensure no duplicates (based on store.id), do something like:
        const uniqueMap = new Map<number, PhysicalStore>();
        allStores.forEach((store) => {
          uniqueMap.set(store.id, store);
        });

        setFetchedStores(Array.from(uniqueMap.values()));
      } catch (error) {
        console.error('Failed to fetch physical stores:', error);
      }
    }

    if (cart.length > 0) {
      fetchStoresForCart();
    } else {
      // Clear if cart is empty
      setFetchedStores([]);
    }
  }, [cart, location]);

  // Group cart items by store code (and store name) for display
  const groupedCart = cart.reduce((acc, item) => {
    const storeCode = item.product.store?.code || 'unknown_code';
    const storeName = item.product.store?.name || 'Ukjent Butikk';

    if (!acc[storeCode]) {
      acc[storeCode] = {
        storeName,
        items: [],
      };
    }
    acc[storeCode].items.push(item);
    return acc;
  }, {} as Record<string, { storeName: string; items: typeof cart }>);

  // Render
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background, paddingTop: 40 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
        Handleliste
      </Text>

      {/* If no items in cart */}
      {Object.keys(groupedCart).length === 0 ? (
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
          Ingen produkter i handlelisten.
        </Text>
      ) : (
        <FlatList
          data={Object.entries(groupedCart)} // => [ [storeCode, { storeName, items }], ... ]
          keyExtractor={([storeCode]) => storeCode}
          renderItem={({ item }) => {
            const [storeCode, { storeName, items }] = item;

            return (
              <View key={storeCode} style={{ marginBottom: 20 }}>
                {/* Store name header */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
                  {storeName}
                </Text>

                {/* Render items under that store */}
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
                      {/* Product Name + Delete Icon */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          {/* Checkbox to mark completed */}
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

                          <Text style={{
                            flex: 1,
                            color: theme.text,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textDecorationLine: completedItems.includes(productIdStr) ? 'line-through' : 'none',
                          }}>
                            {cartItem.product.name}
                          </Text>
                        </View>

                        {/* Trash Icon to remove all of this product */}
                        <TouchableOpacity
                          onPress={() => handleRemoveAllFromCart(productIdStr)}
                          style={{ padding: 8 }}
                        >
                          <AntDesign name="delete" size={22} color="red" />
                        </TouchableOpacity>
                      </View>

                      {/* Quantity Selector & Price */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}
                      >
                        {/* Quantity Control */}
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
                          {/* Decrease quantity */}
                          <TouchableOpacity onPress={() => removeFromCart(productIdStr)}>
                            <AntDesign name="minus" size={19} color={theme.primary} />
                          </TouchableOpacity>

                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 'bold',
                              color: theme.primary,
                              marginHorizontal: 12,
                            }}
                          >
                            {cartItem.quantity}
                          </Text>

                          {/* Increase quantity */}
                          <TouchableOpacity onPress={() => addToCart(cartItem.product)}>
                            <AntDesign name="plus" size={19} color={theme.primary} />
                          </TouchableOpacity>
                        </View>

                        {/* Price Display */}
                        <View>
                          <Text
                            style={{
                              color: theme.text,
                              fontSize: 16,
                              fontWeight: 'bold',
                              textAlign: 'right',
                            }}
                          >
                            {totalPrice} kr
                          </Text>
                          <Text
                            style={{
                              color: theme.text,
                              fontSize: 13,
                              opacity: 0.6,
                              textAlign: 'right',
                            }}
                          >
                            ({cartItem.product.current_price} kr/stk)
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          }}
        />
      )}

      {/* Show the map of all fetched stores (if any) */}
      {fetchedStores.length > 0 && (
        <View style={{ flex: 1, marginTop: 20 }}>
          <ShopsMap stores={fetchedStores} />
        </View>
      )}

      {/* "Tøm Handleliste" Button */}
      {cart.length > 0 && (
        <TouchableOpacity
          onPress={clearCart}
          style={{
            backgroundColor: '#D72638',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <AntDesign name="delete" size={22} color="white" style={{ marginRight: 10 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Tøm Handleliste
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
