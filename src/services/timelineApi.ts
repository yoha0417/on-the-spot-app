import { apiClient } from '@/utils/apiClient';
import type { Post } from '@/types/post';

interface TimelineResponse {
  posts: Post[];
  currentTime: string;
}

export async function fetchTimelinePosts(placeId: string): Promise<TimelineResponse> {
  return apiClient.get<TimelineResponse>(`/timeline?placeId=${encodeURIComponent(placeId)}`);
}
