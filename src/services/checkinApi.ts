import type {
  CheckInResponse,
  CheckOutResponse,
  CurrentCheckInResponse,
} from '@/types/checkin';
import { apiClient } from '@/utils/apiClient';

export async function checkIn(
  lat: number,
  lng: number,
  placeId: string
): Promise<CheckInResponse> {
  return apiClient.post<CheckInResponse>('/checkin', { lat, lng, placeId });
}

export async function checkOut(placeId: string): Promise<CheckOutResponse> {
  return apiClient.post<CheckOutResponse>('/checkout', { placeId });
}

export async function getCurrentCheckIn(): Promise<CurrentCheckInResponse> {
  return apiClient.get<CurrentCheckInResponse>('/checkin/current');
}
