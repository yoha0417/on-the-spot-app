import type { Post } from '@/types/post';
import { apiClient } from '@/utils/apiClient';

interface TimelineResponse {
  posts: Post[];
  currentTime: string;
}

export async function fetchTimelinePosts(placeId: string): Promise<TimelineResponse> {
  return apiClient.get<TimelineResponse>(`/posts?placeId=${encodeURIComponent(placeId)}`);
}
