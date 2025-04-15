// SavingsContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SavingsContextType = {
  moneySaved: number;
  co2Saved: number;
  updateSavings: (money: number, co2: number) => void;
};

const SavingsContext = createContext<SavingsContextType>({
  moneySaved: 0,
  co2Saved: 0,
  updateSavings: () => {},
});

interface SavingsProviderProps {
  children: ReactNode;
}

export const SavingsProvider: React.FC<SavingsProviderProps> = ({ children }) => {
  const [moneySaved, setMoneySaved] = useState<number>(0);
  const [co2Saved, setCo2Saved] = useState<number>(0);

  // Load saved savings from AsyncStorage on mount
  useEffect(() => {
    async function loadSavings() {
      try {
        const savedMoney = await AsyncStorage.getItem('moneySaved');
        const savedCO2 = await AsyncStorage.getItem('co2Saved');
        if (savedMoney !== null) {
          setMoneySaved(Number(savedMoney));
        }
        if (savedCO2 !== null) {
          setCo2Saved(Number(savedCO2));
        }
      } catch (error) {
        console.error('Error loading savings:', error);
      }
    }
    loadSavings();
  }, []);

  // Persist savings whenever they change
  useEffect(() => {
    async function persistSavings() {
      try {
        await AsyncStorage.setItem('moneySaved', moneySaved.toString());
        await AsyncStorage.setItem('co2Saved', co2Saved.toString());
      } catch (error) {
        console.error('Error saving savings:', error);
      }
    }
    persistSavings();
  }, [moneySaved, co2Saved]);

  const updateSavings = (money: number, co2: number) => {
    setMoneySaved(money);
    setCo2Saved(co2);
  };

  return (
    <SavingsContext.Provider value={{ moneySaved, co2Saved, updateSavings }}>
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => useContext(SavingsContext);
