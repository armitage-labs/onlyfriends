export interface CreatePostDto {
  providerId?: string;
  userId?: string;
  text?: string;
}

export interface CreatePostFrameDto {
  postId: string;
  postImage: string;
}
