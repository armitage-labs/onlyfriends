export interface CreatePostDto {
  providerId?: string;
  userId?: string;
  text?: string;
}

export interface CreatePostFrameDto {
  postId: string;
  postImage: string;
}

export interface PostFrameDto {
  id: string;
  post_id: string;
  post_image: string;
}

export interface PostDto {
  id: string;
  user_id: string;
  post_preview_image: string | null;
  text: string;
  created_at: string;
  postsFrames: PostFrameDto[];
}
