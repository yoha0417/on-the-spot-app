import { useEffect, useRef } from 'react';

import { useCheckIn } from '@/contexts/CheckInContext';

interface UseCheckInHeartbeatOptions {
  lat: number;
  lng: number;
}

export function useCheckInHeartbeat({
  lat,
  lng,
}: UseCheckInHeartbeatOptions) {
  const { currentCheckIn, heartbeat } = useCheckIn();

  const locationRef = useRef({ lat, lng });
  const currentCheckInRef = useRef(currentCheckIn);

  useEffect(() => {
    locationRef.current = { lat, lng };
  }, [lat, lng]);

  useEffect(() => {
    currentCheckInRef.current = currentCheckIn;
  }, [currentCheckIn]);

  useEffect(() => {
    const interval = setInterval(() => {
      const record = currentCheckInRef.current;

      if (!record) {
        return;
      }

      void heartbeat(
        locationRef.current.lat,
        locationRef.current.lng,
        record.placeId,
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [heartbeat]);
}
