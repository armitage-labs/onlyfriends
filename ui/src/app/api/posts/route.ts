import { CreatePostDto } from "@/app/types/post.dtos";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../untils/authentication";
import { Posts } from "@prisma/client";
import { fetchUserByProviderId } from "../users/user.service";
import prisma from "db";

export async function POST(req: NextRequest) {
  const createPostDto = (await req.json()) as CreatePostDto;
  const claims = await isAuthenticated(req);

  if (!claims || createPostDto == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const user = await fetchUserByProviderId(createPostDto.providerId!);
  if (user == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const post = await createPost({
    userId: user.id,
    text: createPostDto.text,
  });
  if (post != null) {
    return NextResponse.json({
      success: true,
      post: post,
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }
}

async function createPost(createPostDto: CreatePostDto): Promise<Posts> {
  return await prisma.posts.create({
    data: {
      user_id: createPostDto.userId,
      text: createPostDto.text,
    },
  });
}
