import { isAuthenticated } from "@/app/api/untils/authentication";
import { CreatePostFrameDto } from "@/app/types/post.dtos";
import { PostsFrames } from "@prisma/client";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse> {
  const claims = await isAuthenticated(req);
  if (!claims || req.body == null) {
    return NextResponse.json({
      success: false,
    });
  }

  // TODO need to check if the user owns the post

  if (req.body == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const blob = await put(uuidv4(), req.body, {
    access: "public",
  });
  const frame = await createPostFrame({
    postId: id,
    postImage: blob.url,
  });
  return NextResponse.json(blob);
}

async function createPostFrame(
  createPostDto: CreatePostFrameDto
): Promise<PostsFrames> {
  return await prisma.postsFrames.create({
    data: {
      post_image: createPostDto.postImage,
      post_id: createPostDto.postId,
    },
  });
}
