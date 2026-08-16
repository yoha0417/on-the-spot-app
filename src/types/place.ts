export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  createdAt: string;
  distance: number;
}

export interface NearbyResponse {
  places: Place[];
  currentLocation: {
    lat: number;
    lng: number;
  };
  radius: number;
}
