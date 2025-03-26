import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/types/kassal';

// Define cart item type
interface CartItem {
  product: Product;
  quantity: number;
}

// Define cart context type
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  removeAllFromCart: (productId: string) => void; 
  clearCart: () => void;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add item to cart or update quantity
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id.toString() === product.id.toString());
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id.toString() === product.id.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Remove one instance of the product
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id.toString() === productId.toString()
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove item if quantity is 0
    );
  };

  // Remove all instances of a product at once
  const removeAllFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.product.id.toString() !== productId));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]); 
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeAllFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};