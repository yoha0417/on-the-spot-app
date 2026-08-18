import { apiClient } from '@/utils/apiClient';
import type { VisitWithPlace } from '@/types/visit';

interface UserVisitsResponse {
  visits: VisitWithPlace[];
}

export async function fetchUserVisits(userId: string): Promise<UserVisitsResponse> {
  return apiClient.get<UserVisitsResponse>(`/visits/${encodeURIComponent(userId)}`);
}
