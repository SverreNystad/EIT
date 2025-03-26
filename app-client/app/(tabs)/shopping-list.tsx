import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useCart } from '@/context/ShoppingListContext';
import { AntDesign } from '@expo/vector-icons';

export default function ShoppingListTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme] || Colors.light;
  const { cart, addToCart, removeFromCart, removeAllFromCart, clearCart } = useCart();
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const toggleItem = (productId: string) => {
    setCompletedItems((prev) =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleRemoveAllFromCart = (productId: string) => {
    removeAllFromCart(productId);
    setCompletedItems(prev => prev.filter(id => id !== productId));
  };

  const groupedCart = cart.reduce((acc, item) => {
    const storeName = item.product.store?.name || 'Ukjent Butikk';
    if (!acc[storeName]) acc[storeName] = [];
    acc[storeName].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background, paddingTop: 40 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
        Handleliste
      </Text>

      {Object.keys(groupedCart).length === 0 ? (
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
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
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 10 }}>
                  {store}
                </Text>

                {items.map((item) => {
                  const totalPrice = (item.product.current_price * item.quantity).toFixed(2);

                  return (
                    <View 
                      key={item.product.id.toString()}
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
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <TouchableOpacity 
                            onPress={() => toggleItem(item.product.id.toString())} 
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              borderWidth: 2,
                              borderColor: completedItems.includes(item.product.id.toString()) ? '#4CAF50' : 'gray',
                              backgroundColor: completedItems.includes(item.product.id.toString()) ? '#A5D6A7' : 'transparent',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 10
                            }}
                          >
                            {completedItems.includes(item.product.id.toString()) && (
                              <AntDesign name="check" size={18} color="white" />
                            )}
                          </TouchableOpacity>

                          <Text style={{ 
                            flex: 1,
                            color: theme.text, 
                            fontSize: 16, 
                            fontWeight: 'bold',
                            textDecorationLine: completedItems.includes(item.product.id.toString()) ? 'line-through' : 'none',
                          }}>
                            {item.product.name}
                          </Text>
                        </View>

                        {/* Trash Can Icon */}
                        <TouchableOpacity 
                          onPress={() => handleRemoveAllFromCart(item.product.id.toString())}
                          style={{ padding: 8 }}
                        >
                          <AntDesign name="delete" size={22} color="red" />
                        </TouchableOpacity>
                      </View>

                      {/* Quantity Selector & Price */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
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
                            marginLeft: 40
                          }}
                        >
                          <TouchableOpacity onPress={() => removeFromCart(item.product.id.toString())}>
                            <AntDesign name="minus" size={19} color={theme.primary} />
                          </TouchableOpacity>

                          <Text style={{ fontSize: 13, fontWeight: 'bold', color: theme.primary, marginHorizontal: 12 }}>
                            {item.quantity}
                          </Text>

                          <TouchableOpacity onPress={() => addToCart(item.product)}>
                            <AntDesign name="plus" size={19} color={theme.primary} />
                          </TouchableOpacity>
                        </View>

                        {/* Price Section */}
                        <View>
                          <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>
                            {totalPrice} kr
                          </Text>
                          <Text style={{ color: theme.text, fontSize: 13, opacity: 0.6, textAlign: 'right' }}>
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
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Tøm Handleliste</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}