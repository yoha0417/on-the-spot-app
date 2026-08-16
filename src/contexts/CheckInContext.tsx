import { checkIn as apiCheckIn, checkOut as apiCheckOut, sendHeartbeat as apiSendHeartbeat } from '@/services/checkinApi';
import type { CheckInRecord } from '@/types/checkin';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type CheckInContextValue = {
  currentCheckIn: CheckInRecord | null;
  checkIn: (lat: number, lng: number, placeId: string) => Promise<void>;
  checkOut: (placeId: string) => Promise<void>;
  heartbeat: (lat: number, lng: number, placeId: string) => Promise<void>;
};

const CheckInContext = createContext<CheckInContextValue | undefined>(undefined);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckInRecord | null>(null);

  const checkIn = useCallback(async (lat: number, lng: number, placeId: string) => {
    const record = await apiCheckIn(lat, lng, placeId);
    setCurrentCheckIn(record);
  }, []);

  const checkOut = useCallback(async (placeId: string) => {
    await apiCheckOut(placeId);
    setCurrentCheckIn(null);
  }, []);

  const heartbeat = useCallback(
    async (lat: number, lng: number, placeId: string) => {
      try {
        const response = await apiSendHeartbeat(lat, lng, placeId);

        if (!response.success) {
          setCurrentCheckIn(null);
        }
      } catch {
        // 一時的な通信エラーは次の30秒後のハートビートに再試行させる
      }
    },
    [],
  );

  const value = useMemo(
    () => ({ currentCheckIn, checkIn, checkOut, heartbeat }),
    [currentCheckIn, checkIn, checkOut, heartbeat],
  );

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
}

export function useCheckIn(): CheckInContextValue {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
}
