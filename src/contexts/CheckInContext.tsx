import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { checkIn as apiCheckIn, checkOut as apiCheckOut } from '@/services/checkinApi';
import type { CheckInRecord } from '@/types/checkin';

type CheckInContextValue = {
  currentCheckIn: CheckInRecord | null;
  checkIn: (lat: number, lng: number, placeId: string) => Promise<void>;
  checkOut: (placeId: string) => Promise<void>;
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

  const value = useMemo(
    () => ({ currentCheckIn, checkIn, checkOut }),
    [currentCheckIn, checkIn, checkOut],
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
