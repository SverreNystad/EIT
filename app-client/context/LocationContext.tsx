import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

interface UserLocation {
  lat: number;
  lng: number;
}

interface LocationContextType {
  location: UserLocation | null;
  errorMsg: string | null;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Request location permission and fetch location
  const refreshLocation = async () => {
    try {
      // 1) Ask permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Tillatelse for posisjon ble avslått');
        return;
      }

      // 2) If granted, get current location
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    } catch (error) {
      console.error('Failed to refresh location:', error);
      setErrorMsg(String(error));
    }
  };

  // On mount, fetch location immediately
  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, errorMsg, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Helper hook
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
