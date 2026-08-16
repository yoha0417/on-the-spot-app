import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useSimulatedLocation } from '@/hooks/useSimulatedLocation';
import { ProtectedScreen } from '@/components/protected-screen';

export default function MapScreen() {
  const { latitude, longitude } = useSimulatedLocation();

  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation
          followsUserLocation
        />
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
