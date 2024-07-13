import { CreatePostDto } from "@/app/types/post.dtos";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, isAuthenticated2 } from "../untils/authentication";
import { Posts } from "@prisma/client";
import { fetchUserByProviderId } from "../users/user.service";
import prisma from "db";

export async function GET(req: NextRequest) {
  const providerId = req.nextUrl.searchParams.get("providerId");
  await isAuthenticated2(req);
  if (!isAuthenticated2(req) || providerId == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const user = await fetchUserByProviderId(providerId);
  if (user == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const posts = await fetchPosts(user.id);

  return NextResponse.json({
    success: true,
    posts: posts,
  });
}

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

async function fetchPosts(userId: string) {
  return await prisma.posts.findMany({
    where: {
      user_id: userId,
    },
    include: {
      postsFrames: true,
    },
  });
}
