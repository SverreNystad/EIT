import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';
import { Product } from '@/types/kassal';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation stack
type HomeStackParamList = {
  home: undefined;
  deals: undefined;
  products: undefined;
  singleProduct: { product: Product };
};

// Navigation typing
type NavigationProp = StackNavigationProp<HomeStackParamList, 'singleProduct'>;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProp>();

  // Toggle checkbox state
  const toggleItem = (productId: string) => {
    setCompletedItems((prev) =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Navigate to product details page
  const handlePressProduct = (product: Product) => {
    navigation.navigate('singleProduct', { product });
  };

  // ✅ Fully clears shopping cart
  const handleClearCart = () => {
    clearCart();
  };

  // Group items by store
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

                {items.map((item) => (
                  <View 
                    key={item.product.id.toString()}
                    style={{
                      padding: 12, 
                      backgroundColor: colors.card, 
                      borderRadius: 10, 
                      marginBottom: 8,
                    }}
                  >
                    {/* ✅ First Row: Checkbox + Product Name (Clickable) */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                          marginRight: 10,
                        }}
                      >
                        {completedItems.includes(item.product.id.toString()) && (
                          <AntDesign name="check" size={16} color="white" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handlePressProduct(item.product)}>
                        <Text style={{ 
                          color: colors.text, 
                          fontSize: 16, 
                          textDecorationLine: completedItems.includes(item.product.id.toString()) ? 'line-through' : 'none',
                        }}>
                          {item.product.name}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* ✅ Second Row: Price + Quantity Selector */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      {/* Product Price */}
                      <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>
                        {item.product.current_price} kr
                      </Text>

                      {/* Quantity Selector (Styled like Image) */}
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
                        <TouchableOpacity onPress={() => removeFromCart(item.product.id.toString())}>
                          <AntDesign name="minus" size={18} color={colors.text} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text, marginHorizontal: 12 }}>
                          {item.quantity}
                        </Text>

                        <TouchableOpacity onPress={() => addToCart(item.product)}>
                          <AntDesign name="plus" size={18} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}

      {/* ✅ Fixed "Tøm Handleliste" (Removes All Items) */}
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
