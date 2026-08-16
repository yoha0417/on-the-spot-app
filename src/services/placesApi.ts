import { apiClient } from '@/utils/apiClient';
import type { NearbyResponse } from '@/types/place';

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 3000
): Promise<NearbyResponse> {
  return apiClient.get<NearbyResponse>(
    `/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );
}
