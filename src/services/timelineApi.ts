import type { Post } from '@/types/post';
import { apiClient } from '@/utils/apiClient';

interface TimelineResponse {
  posts: Post[];
  currentTime: string;
}

export async function fetchTimelinePosts(placeId: string): Promise<TimelineResponse> {
  return apiClient.get<TimelineResponse>(`/posts?placeId=${encodeURIComponent(placeId)}`);
}

interface CreatePostRequest {
  content: string;
  placeId: string;
  is_delayed_publish: boolean;
}

interface CreatePostResponse {
  success: true;
  post: Post;
}

export async function createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
  return apiClient.post<CreatePostResponse>('/posts', data);
}

interface ToggleLikeResponse {
  success: true;
  likesCount: number;
}

export async function toggleLike(postId: string): Promise<ToggleLikeResponse> {
  return apiClient.post<ToggleLikeResponse>(`/posts/${encodeURIComponent(postId)}/like`);
}
