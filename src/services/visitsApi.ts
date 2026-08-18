import type { VisitWithPlace } from '@/types/visit';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

/** 直近のVisit (JOIN place) を取得する想定 */
export async function fetchCurrentVisit(): Promise<{ visit: VisitWithPlace }> {
  const response = await fetch(`${BASE_URL}/v1/visits/current`);
  if (!response.ok) {
    throw new Error(`Failed to fetch current visit: ${response.status}`);
  }
  return response.json();
}
