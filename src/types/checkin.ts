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

export interface HeartbeatRequest {
  lat: number;
  lng: number;
  placeId: string;
}

export type HeartbeatResponse =
  | {
      success: true;
    }
  | {
      success: false;
      status: 'checked_out';
      message: string;
    };
