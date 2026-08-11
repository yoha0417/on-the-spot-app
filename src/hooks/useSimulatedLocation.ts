import { useState, useEffect, useRef } from 'react';

const INITIAL_LATITUDE = 35.6852;
const INITIAL_LONGITUDE = 139.7101;
const STEP = 0.0001;
const INTERVAL_MS = 3000;

// __DEV__ のときだけ true になる。外部から強制的に変更したい場合はこの定数を直接編集する。
const ENABLE_SIMULATION = __DEV__;

interface SimulatedLocation {
  latitude: number;
  longitude: number;
}

export function useSimulatedLocation(): SimulatedLocation {
  const [coords, setCoords] = useState<SimulatedLocation>({
    latitude: INITIAL_LATITUDE,
    longitude: INITIAL_LONGITUDE,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!ENABLE_SIMULATION) return;

    intervalRef.current = setInterval(() => {
      setCoords(prev => ({
        latitude: prev.latitude + STEP,
        longitude: prev.longitude + STEP,
      }));
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return coords;
}
