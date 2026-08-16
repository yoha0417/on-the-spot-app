export type CheckInStatus = 'active' | 'ended';

export interface CheckInRecord {
  id: string;
  placeId: string;
  userId: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: CheckInStatus;
}

export interface CheckInResponse {
  checkIn: CheckInRecord;
}

export interface CheckOutResponse {
  success: boolean;
}

export interface CurrentCheckInResponse {
  checkIn: CheckInRecord | null;
}
