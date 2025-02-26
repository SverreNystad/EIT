import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem, Product } from '../types/kassal';

interface ShoppingListContextType {
  shoppingList: ShoppingItem[];
  addToShoppingList: (product: Product) => void;
  removeFromShoppingList: (id: number) => void;
  toggleItemChecked: (id: number) => void;
  clearShoppingList: () => void;
  saveForLater: () => Promise<boolean>;
  loadSavedList: () => Promise<boolean>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

interface ShoppingListProviderProps {
  children: ReactNode;
}

export const ShoppingListProvider = ({ children }: ShoppingListProviderProps) => {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  
  // Load shopping list from storage on initial load
  useEffect(() => {
    const loadShoppingList = async () => {
      try {
        const savedList = await AsyncStorage.getItem('shoppingList');
        if (savedList) {
          setShoppingList(JSON.parse(savedList));
        }
      } catch (error) {
        console.error('Failed to load shopping list:', error);
      }
    };
    
    loadShoppingList();
  }, []);
  
  // Save shopping list to storage whenever it changes
  useEffect(() => {
    const saveShoppingList = async () => {
      try {
        await AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
      } catch (error) {
        console.error('Failed to save shopping list:', error);
      }
    };
    
    if (shoppingList.length > 0) {
      saveShoppingList();
    }
  }, [shoppingList]);
  
  const addToShoppingList = (product: Product) => {
    // Check if product already exists in the list
    const exists = shoppingList.some(item => item.id === product.id);
    
    if (!exists) {
      setShoppingList(prevList => [
        ...prevList,
        { ...product, checked: false }
      ]);
    }
  };
  
  const removeFromShoppingList = (id: number) => {
    setShoppingList(prevList => prevList.filter(item => item.id !== id));
  };
  
  const toggleItemChecked = (id: number) => {
    setShoppingList(prevList => 
      prevList.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const clearShoppingList = () => {
    setShoppingList([]);
    AsyncStorage.removeItem('shoppingList');
  };
  
  const saveForLater = async (): Promise<boolean> => {
    try {
      const timestamp = new Date().toISOString();
      const savedListName = `savedList_${timestamp}`;
      
      // Save current list with timestamp
      await AsyncStorage.setItem(savedListName, JSON.stringify(shoppingList));
      
      // Update saved lists index
      const savedListsIndex = await AsyncStorage.getItem('savedListsIndex');
      const savedLists = savedListsIndex ? JSON.parse(savedListsIndex) : [];
      
      savedLists.push({
        id: savedListName,
        name: `Handleliste ${savedLists.length + 1}`,
        date: timestamp,
        itemCount: shoppingList.length
      });
      
      await AsyncStorage.setItem('savedListsIndex', JSON.stringify(savedLists));
      
      return true;
    } catch (error) {
      console.error('Failed to save list for later:', error);
      return false;
    }
  };
  
  const loadSavedList = async (): Promise<boolean> => {
    try {
      const savedListsIndex = await AsyncStorage.getItem('savedListsIndex');
      
      if (!savedListsIndex) {
        return false;
      }
      
      const savedLists = JSON.parse(savedListsIndex);
      
      if (savedLists.length === 0) {
        return false;
      }
      
      // Load the most recent saved list
      const mostRecentList = savedLists[savedLists.length - 1];
      const savedListData = await AsyncStorage.getItem(mostRecentList.id);
      
      if (savedListData) {
        setShoppingList(JSON.parse(savedListData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to load saved list:', error);
      return false;
    }
  };
  
  return (
    <ShoppingListContext.Provider
      value={{
        shoppingList,
        addToShoppingList,
        removeFromShoppingList,
        toggleItemChecked,
        clearShoppingList,
        saveForLater,
        loadSavedList
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  
  return context;
};
