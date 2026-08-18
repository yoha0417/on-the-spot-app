export interface VisitWithPlace {
  id: string;
  userId: string;
  placeId: string;
  checkInAt: string;
  checkOutAt?: string;
  stayDurationMinutes: number;
  // 場所情報へのJOIN
  placeName: string;
  placeDescription?: string;
  placeLat: number;
  placeLng: number;
  placeOpenTime?: string; // 例 "09:00"
  placeCloseTime?: string; // 例 "21:00"
  placeAddress?: string;
}
