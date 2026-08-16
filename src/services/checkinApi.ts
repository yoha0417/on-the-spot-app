import type {
  CheckInResponse,
  CheckOutResponse,
  CurrentCheckInResponse,
} from '@/types/checkin';
import { apiClient } from '@/utils/apiClient';

export async function checkIn(placeId: string): Promise<CheckInResponse> {
  return apiClient.post<CheckInResponse>('/checkin', { placeId });
}

export async function checkOut(): Promise<CheckOutResponse> {
  return apiClient.post<CheckOutResponse>('/checkout');
}

export async function getCurrentCheckIn(): Promise<CurrentCheckInResponse> {
  return apiClient.get<CurrentCheckInResponse>('/checkin/current');
}
