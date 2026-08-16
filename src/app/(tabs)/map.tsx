import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useSimulatedLocation } from '@/hooks/useSimulatedLocation';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import { ProtectedScreen } from '@/components/protected-screen';

export default function MapScreen() {
  const { latitude, longitude } = useSimulatedLocation();
  const { places, error } = useNearbyPlaces({
    lat: latitude,
    lng: longitude,
    radius: 3000,
  });

  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  if (error) {
    console.error(error);
  }

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <MapView style={styles.map} region={region}>
          <Marker coordinate={{ latitude, longitude }}>
            <View style={styles.userMarker} />
          </Marker>

          {places.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={place.address ?? undefined}
              pinColor="red"
            />
          ))}
        </MapView>
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: 'white',
  },
});
