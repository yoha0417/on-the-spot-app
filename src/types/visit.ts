export interface PlaceInfo {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface VisitWithPlace {
  visitId: string;
  checkedInAt: string;
  checkedOutAt: string | null;
  status: 'active' | 'checked_out';
  durationMinutes: number;
  place: PlaceInfo;
}
