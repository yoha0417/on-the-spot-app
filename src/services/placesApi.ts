import type { NearbyResponse } from '@/types/place';
import { apiClient } from '@/utils/apiClient';

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number = 3000
): Promise<NearbyResponse> {
  return apiClient.get<NearbyResponse>(
    `/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );
}
