import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';
import { Product } from '@/types/kassal';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation stack
type HomeStackParamList = {
  singleProduct: { product: Product };
};

// Navigation typing
type NavigationProp = StackNavigationProp<HomeStackParamList, 'singleProduct'>;

export default function TabTwoScreen() {
  const { colors } = useTheme();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProp>();

  // ✅ Navigate to product details page
  const handlePressProduct = (product: Product) => {
    navigation.navigate('singleProduct', { product });
  };

  // ✅ Toggle checkbox state
  const toggleItem = (productId: string) => {
    setCompletedItems((prev) =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // ✅ Remove item from cart AND reset its checkbox state
  const handleRemoveFromCart = (productId: string) => {
    setCompletedItems((prev) => prev.filter(id => id !== productId)); // ✅ Uncheck item on remove
    removeFromCart(productId);
  };

  // ✅ Fully clears shopping cart and resets checkbox states
  const handleClearCart = () => {
    setCompletedItems([]); // ✅ Reset all checkboxes
    clearCart();
  };

  // ✅ Group items by store
  const groupedCart = cart.reduce((acc, item) => {
    const storeName = item.product.store?.name || 'Ukjent Butikk';
    if (!acc[storeName]) acc[storeName] = [];
    acc[storeName].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background, paddingTop: 40 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
        Handleliste
      </Text>

      {Object.keys(groupedCart).length === 0 ? (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>
          Ingen produkter i handlelisten.
        </Text>
      ) : (
        <FlatList
          data={Object.entries(groupedCart)}
          keyExtractor={([store]) => store}
          renderItem={({ item }) => {
            const [store, items] = item;

            return (
              <View key={store} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>
                  {store}
                </Text>

                {items.map((item) => {
                  const totalPrice = (item.product.current_price * item.quantity).toFixed(2);

                  return (
                    <View 
                      key={item.product.id.toString()}
                      style={{
                        backgroundColor: colors.card, 
                        borderRadius: 12, 
                        padding: 12, 
                        marginBottom: 12,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 4,
                      }}
                    >
                      {/* ✅ First Row: Checkbox + Product Name */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Checkbox */}
                        <TouchableOpacity 
                          onPress={() => toggleItem(item.product.id.toString())} 
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor: completedItems.includes(item.product.id.toString()) ? '#4CAF50' : 'gray',
                            backgroundColor: completedItems.includes(item.product.id.toString()) ? '#A5D6A7' : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {completedItems.includes(item.product.id.toString()) && (
                            <AntDesign name="check" size={16} color="white" />
                          )}
                        </TouchableOpacity>

                        {/* ✅ Clickable Product Name */}
                        <TouchableOpacity 
                          onPress={() => handlePressProduct(item.product)}
                          style={{ flex: 1, marginLeft: 10 }}
                        >
                          <Text style={{ 
                            color: colors.text, 
                            fontSize: 16, 
                            fontWeight: 'bold',
                            textDecorationLine: completedItems.includes(item.product.id.toString()) ? 'line-through' : 'none',
                          }}>
                            {item.product.name}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* ✅ Second Row: Quantity Selector */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        {/* Quantity Selector (Centered below name) */}
                        <View 
                          style={{
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            borderWidth: 1, 
                            borderColor: colors.text, 
                            borderRadius: 8, 
                            paddingHorizontal: 12, 
                            paddingVertical: 4,
                          }}
                        >
                          <TouchableOpacity onPress={() => handleRemoveFromCart(item.product.id.toString())}>
                            <AntDesign name="minus" size={18} color={colors.text} />
                          </TouchableOpacity>

                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text, marginHorizontal: 12 }}>
                            {item.quantity}
                          </Text>

                          <TouchableOpacity onPress={() => addToCart(item.product)}>
                            <AntDesign name="plus" size={18} color={colors.text} />
                          </TouchableOpacity>
                        </View>

                        {/* ✅ Price Section (Total Price Bold) */}
                        <View>
                          <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>
                            {totalPrice} kr
                          </Text>
                          <Text style={{ color: colors.text, fontSize: 13, opacity: 0.6, textAlign: 'right' }}>
                            ({item.product.current_price} kr/stk)
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

      {/* ✅ Fixed "Tøm Handleliste" (Removes All Items and Unchecks Everything) */}
      {cart.length > 0 && (
        <TouchableOpacity 
          onPress={handleClearCart} 
          style={{
            backgroundColor: '#D72638', 
            padding: 14, 
            borderRadius: 10, 
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <AntDesign name="delete" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Tøm Handleliste</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
