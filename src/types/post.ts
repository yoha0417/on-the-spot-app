export interface Post {
  id: string;
  userId: string;
  placeId: string;
  content: string;
  createdAt: string;
  userName: string;
  stayDurationMinutes: number;
  likesCount: number;
  isLiked: boolean;
  isWaitingForUnlock: boolean;
}
