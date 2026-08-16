import { useState, useEffect, useRef } from 'react';
import type { Place } from '@/types/place';
import { fetchNearbyPlaces } from '@/services/placesApi';

interface UseNearbyPlacesProps {
  lat: number;
  lng: number;
  radius?: number;
}

export function useNearbyPlaces({ lat, lng, radius = 3000 }: UseNearbyPlacesProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const latRef = useRef(lat);
  const lngRef = useRef(lng);
  const radiusRef = useRef(radius);

  useEffect(() => {
    latRef.current = lat;
    lngRef.current = lng;
    radiusRef.current = radius;
  }, [lat, lng, radius]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNearbyPlaces(
          latRef.current,
          lngRef.current,
          radiusRef.current
        );
        setPlaces(data.places);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return { places, error };
}
