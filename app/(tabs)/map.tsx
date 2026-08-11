import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Text, Surface, useTheme } from 'react-native-paper';
import { useSimulatedLocation } from '@/hooks/useSimulatedLocation';

export default function MapScreen() {
  const theme = useTheme();
  const { latitude, longitude } = useSimulatedLocation();

  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={false}
      >
        <Marker coordinate={{ latitude, longitude }} title="現在地" />
      </MapView>

      {/* 座標オーバーレイ */}
      <Surface style={[styles.overlay, { backgroundColor: theme.colors.surface }]}>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
          緯度: {latitude.toFixed(6)}  経度: {longitude.toFixed(6)}
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    opacity: 0.95,
  },
});
