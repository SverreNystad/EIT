import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useLocationContext } from '@/context/LocationContext';
import { PhysicalStore } from '@/types/kassal';

interface ShopMapProps {
    stores: PhysicalStore[]
}

export default function ShopsMapScreen({stores}: ShopMapProps) {
  // Read location info and errors from context
  const { location, errorMsg } = useLocationContext();
  
  // Fallback region if we have no real location yet
  const [fallbackRegion] = useState<Region>({
    latitude: 59.91,     // e.g. Oslo
    longitude: 10.75,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // If we have no location and no error yet, we might still be loading
  if (!location && !errorMsg) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Henter posisjon…</Text>
      </View>
    );
  }

  // If there's an error
  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMsg}</Text>
        <Text>Kan ikke vise kart uten posisjon.</Text>
      </View>
    );
  }

  // If we got a location from context, set map region
  const userRegion: Region = {
    latitude: location?.lat ?? fallbackRegion.latitude,
    longitude: location?.lng ?? fallbackRegion.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={userRegion}
      >
        {/* User marker */}
        {location && (
          <Marker
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            title="Du er her"
            pinColor="blue"
          />
        )}

        {/* Shops markers */}
        {stores.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.position.lat, longitude: shop.position.lng }}
            title={shop.name}
            description="Butikk"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
