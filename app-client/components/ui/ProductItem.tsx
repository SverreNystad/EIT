import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  LayoutRectangle,
  findNodeHandle,
  UIManager,
  Animated,
} from "react-native";
import Colors from "@/constants/Colors";
import { Product } from "@/types/kassal";
import { useCart } from "@/context/ShoppingListContext";
import { AntDesign } from "@expo/vector-icons";

// Replace with the actual cart icon position in your layout or tab bar
// In a real app, measure the cart icon once (like in your parent screen or tab bar) and store these values
const CART_ICON_POSITION = { x: 130, y: 700 };

interface ProductItemProps {
  product: Product;
  isOffer?: boolean;
  onPress: () => void;
}

export default function ProductItem({ product, isOffer, onPress }: ProductItemProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme] || Colors.light;
  const { addToCart, cart } = useCart();
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Animated overlay references
  const [overlayVisible, setOverlayVisible] = useState(false);
  const animatedPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animatedScale = useRef(new Animated.Value(1)).current;

  // We store item position after onLayout
  const [itemLayout, setItemLayout] = useState<LayoutRectangle | null>(null);

  // Handle the measurement of the product card or image
  const onItemLayout = (e: any) => {
    setItemLayout(e.nativeEvent.layout);
  };

  const handleAddToCart = async () => {
    // 1) Add to cart right away
    addToCart(product);

    if (itemLayout) {
      // 2) Start the "fly" animation
      setOverlayVisible(true);

      // Set the initial position of the overlay
      animatedPosition.setValue({ x: itemLayout.x, y: itemLayout.y });
      animatedScale.setValue(1);

      // Animate to the cart icon
      Animated.parallel([
        Animated.timing(animatedPosition, {
          toValue: { x: CART_ICON_POSITION.x, y: CART_ICON_POSITION.y },
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedScale, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setOverlayVisible(false);
      });
    }
  };

  return (
    <View>
      {/* Overlay for fly-to-cart animation */}
      {overlayVisible && (
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: [
              { translateX: animatedPosition.x },
              { translateY: animatedPosition.y },
              { scale: animatedScale },
            ],
            zIndex: 999,
          }}
        >
          {/* You can render a copy of the product image or a small icon */}
          <Image
            source={{ uri: product.image }}
            style={{ width: 80, height: 80, borderRadius: 10 }}
          />
        </Animated.View>
      )}

      {/* Main product item */}
      <TouchableOpacity
        onPress={onPress}
        onLayout={onItemLayout}
        style={{
          backgroundColor: theme.card,
          borderRadius: 16,
          padding: 12,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowRadius: 6,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
        }}
      >
        {/* Product Image */}
        <Image
          source={{ uri: product.image }}
          style={{ width: 80, height: 80, borderRadius: 10, marginRight: 12 }}
        />

        {/* Product Details */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: theme.text }}>
            {product.name}
          </Text>
          <Text style={{ fontSize: 13, color: theme.text, opacity: 0.7 }}>
            {product.store?.name}
          </Text>

          {/* Price Section */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            {isOffer && (
              <Text
                style={{
                  fontSize: 14,
                  textDecorationLine: "line-through",
                  color: theme.text,
                  opacity: 0.5,
                }}
              >
                199 kr
              </Text>
            )}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: isOffer ? "#D72638" : theme.primary,
                marginLeft: 6,
              }}
            >
              {product.current_price} kr
            </Text>
          </View>
        </View>

        {/* Add to Cart Section */}
        <TouchableOpacity
          onPress={handleAddToCart}
          style={{ backgroundColor: theme.primary, borderRadius: 20, padding: 8 }}
        >
          <AntDesign name="plus" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

