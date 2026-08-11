import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const hydrated = useSyncExternalStore(
    () => () => {}, // subscribe（何もしない）
    () => true,     // クライアントでは常に true
    () => false,    // SSR/サーバーでは false
  );

  const colorScheme = useRNColorScheme();

  if (!hydrated) {
    return 'light';
  }
  return colorScheme;
}
