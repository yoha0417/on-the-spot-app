import { ProtectedScreen } from '@/components/protected-screen';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import { useSimulatedLocation } from '@/hooks/useSimulatedLocation';
import { checkIn, checkOut, getCurrentCheckIn } from '@/services/checkinApi';
import type { CheckInRecord } from '@/types/checkin';
import type { Place } from '@/types/place';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';

const CHECKIN_RADIUS = 1000;

function getDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapScreen() {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);
  const { latitude, longitude } = useSimulatedLocation();
  const { places, error } = useNearbyPlaces({
    lat: latitude,
    lng: longitude,
    radius: 3000,
  });

  const [currentCheckIn, setCurrentCheckIn] = useState<CheckInRecord | null>(null);
  const [loadingPlaceId, setLoadingPlaceId] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [initialRegion] = useState<Region>(() => ({
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }));

  const handleRecenter = useCallback(() => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  }, [latitude, longitude]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  // 現在のチェックイン状態を取得
  useEffect(() => {
    const fetchCurrentCheckIn = async () => {
      try {
        const res = await getCurrentCheckIn();
        setCurrentCheckIn(res.checkIn);
      } catch {
        // 未チェックインまたはエラー時は null のまま
      }
    };
    fetchCurrentCheckIn();
  }, []);

  const handleCheckIn = useCallback(
    async (placeId: string) => {
      setLoadingPlaceId(placeId);
      try {
        const res = await checkIn(latitude, longitude, placeId);
        setCurrentCheckIn(res.checkIn);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'チェックインに失敗しました';
        Alert.alert('エラー', message);
      } finally {
        setLoadingPlaceId(null);
      }
    },
    [latitude, longitude]
  );

  const handleCheckOut = useCallback(async (placeId: string) => {
    setLoadingPlaceId(placeId);
    try {
      await checkOut(placeId);
      setCurrentCheckIn(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'チェックアウトに失敗しました';
      Alert.alert('エラー', message);
    } finally {
      setLoadingPlaceId(null);
    }
  }, []);

  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
        >
          <Marker coordinate={{ latitude, longitude }}>
            <View style={styles.userMarker} />
          </Marker>

          {places.map((place) => {
            return (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.address ?? undefined}
                pinColor="red"
                onPress={() => setSelectedPlace(place)}
              />
            );
          })}
        </MapView>

        {selectedPlace && (() => {
          const distance = getDistance(
            { latitude, longitude },
            { latitude: selectedPlace.latitude, longitude: selectedPlace.longitude }
          );
          const isCheckedIn = currentCheckIn?.placeId === selectedPlace.id;
          const isInRange = distance <= CHECKIN_RADIUS;
          const isLoading = loadingPlaceId === selectedPlace.id;

          return (
            <View style={styles.selectedCard}>
              <View style={styles.selectedCardHeader}>
                <Text variant="titleMedium" style={styles.calloutTitle}>
                  {selectedPlace.name}
                </Text>
                <Button
                  mode="text"
                  onPress={() => setSelectedPlace(null)}
                  compact
                >
                  閉じる
                </Button>
              </View>
              {selectedPlace.address && (
                <Text variant="bodySmall" style={styles.calloutAddress}>
                  {selectedPlace.address}
                </Text>
              )}
              <Text variant="bodySmall" style={styles.calloutDistance}>
                現在地から約{Math.floor(distance)}m
              </Text>

              {isCheckedIn ? (
                <Button
                  mode="contained"
                  onPress={() => handleCheckOut(selectedPlace.id)}
                  loading={isLoading}
                  disabled={isLoading}
                  buttonColor={theme.colors.error}
                  textColor={theme.colors.onError}
                  style={styles.calloutButton}
                  labelStyle={styles.calloutButtonLabel}
                >
                  チェックアウト
                </Button>
              ) : isInRange ? (
                <Button
                  mode="contained"
                  onPress={() => handleCheckIn(selectedPlace.id)}
                  loading={isLoading}
                  disabled={isLoading}
                  buttonColor="#10B981"
                  textColor="#FFFFFF"
                  style={styles.calloutButton}
                  labelStyle={styles.calloutButtonLabel}
                >
                  チェックイン
                </Button>
              ) : (
                <Text variant="bodySmall" style={styles.outOfRangeText}>
                  チェックイン範囲外です（現在: 約{Math.floor(distance)}m）
                </Text>
              )}
            </View>
          );
        })()}

        <IconButton
          mode="contained"
          icon="crosshairs-gps"
          onPress={handleRecenter}
          style={[
            styles.recenterButton,
            selectedPlace ? styles.recenterButtonAboveCard : styles.recenterButtonBottom,
          ]}
          containerColor={theme.colors.primary}
          iconColor={theme.colors.onPrimary}
          accessibilityLabel="現在地に移動"
        />
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
  recenterButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    elevation: 6,
  },
  recenterButtonBottom: {
    bottom: 24,
  },
  recenterButtonAboveCard: {
    bottom: 200,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  selectedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutAddress: {
    color: '#666',
    marginBottom: 4,
  },
  calloutDistance: {
    color: '#888',
    marginBottom: 8,
  },
  calloutButton: {
    marginTop: 4,
    borderRadius: 4,
  },
  calloutButtonLabel: {
    fontSize: 13,
  },
  outOfRangeText: {
    color: '#EF4444',
    marginTop: 4,
  },
});
