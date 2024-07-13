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

export async function fetchPosts(userId: string) {
  return await prisma.posts.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      postsFrames: true,
    },
  });
}
