import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { Text, Button, useTheme } from 'react-native-paper';
import { getDistance } from 'geolib';
import { useSimulatedLocation } from '@/hooks/useSimulatedLocation';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import { ProtectedScreen } from '@/components/protected-screen';
import { checkIn, checkOut, getCurrentCheckIn } from '@/services/checkinApi';
import type { CheckInRecord } from '@/types/checkin';

const CHECKIN_RADIUS = 50;

export default function MapScreen() {
  const theme = useTheme();
  const { latitude, longitude } = useSimulatedLocation();
  const { places, error } = useNearbyPlaces({
    lat: latitude,
    lng: longitude,
    radius: 3000,
  });

  const [currentCheckIn, setCurrentCheckIn] = useState<CheckInRecord | null>(null);
  const [loadingPlaceId, setLoadingPlaceId] = useState<string | null>(null);

  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

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
      } catch (_e) {
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
        <MapView style={styles.map} region={region}>
          <Marker coordinate={{ latitude, longitude }}>
            <View style={styles.userMarker} />
          </Marker>

          {places.map((place) => {
            const distance = getDistance(
              { latitude, longitude },
              { latitude: place.latitude, longitude: place.longitude }
            );
            const isCheckedIn = currentCheckIn?.placeId === place.id;
            const isInRange = distance <= CHECKIN_RADIUS;
            const isLoading = loadingPlaceId === place.id;

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
              >
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <Text variant="titleSmall" style={styles.calloutTitle}>
                      {place.name}
                    </Text>
                    {place.address && (
                      <Text variant="bodySmall" style={styles.calloutAddress}>
                        {place.address}
                      </Text>
                    )}
                    <Text variant="bodySmall" style={styles.calloutDistance}>
                      現在地から約{distance}m
                    </Text>

                    {isCheckedIn ? (
                      <Button
                        mode="contained"
                        onPress={() => handleCheckOut(place.id)}
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
                        onPress={() => handleCheckIn(place.id)}
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
                        チェックイン範囲外です（現在: 約{distance}m）
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            );
          })}
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
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
