import type { CheckInRecord, CheckOutResponse } from '@/types/checkin';
import { apiClient } from '@/utils/apiClient';

type UnknownRecord = Record<string, unknown>;

function isCheckInRecord(value: unknown): value is CheckInRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as UnknownRecord;
  return (
    typeof record.id === 'string' &&
    typeof record.placeId === 'string' &&
    typeof record.userId === 'string' &&
    typeof record.checkInTime === 'string' &&
    (record.checkOutTime === null || typeof record.checkOutTime === 'string') &&
    (record.status === 'active' || record.status === 'ended')
  );
}

function extractCheckInRecord(data: unknown): CheckInRecord | null {
  if (isCheckInRecord(data)) return data;
  if (typeof data !== 'object' || data === null) return null;
  const record = data as UnknownRecord;
  const keys = ['checkIn', 'checkin', 'data', 'result', 'record'];
  for (const key of keys) {
    const nested = record[key];
    if (isCheckInRecord(nested)) return nested;
    if (typeof nested === 'object' && nested !== null) {
      const found = extractCheckInRecord(nested);
      if (found) return found;
    }
  }
  return null;
}

export async function checkIn(
  lat: number,
  lng: number,
  placeId: string,
): Promise<CheckInRecord> {
  const data = await apiClient.post<unknown>('/checkin', { lat, lng, placeId });
  const checkInRecord = extractCheckInRecord(data);
  if (!checkInRecord) {
    throw new Error('チェックインAPIのレスポンス形式が不正です');
  }
  return checkInRecord;
}

export async function checkOut(placeId: string): Promise<CheckOutResponse> {
  return apiClient.post<CheckOutResponse>('/checkout', { placeId });
}
