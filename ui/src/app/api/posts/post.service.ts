import { Posts, PostsFrames } from "@prisma/client";
import prisma from "db";

export async function fetchPost(postId: string): Promise<Posts | null> {
  return await prisma.posts.findFirst({
    where: {
      id: postId,
    },
  });
}

export async function fetchPostFrames(
  postId: string
): Promise<PostsFrames | null> {
  return await prisma.postsFrames.findFirst({
    where: {
      post_id: postId,
    },
  });
}
