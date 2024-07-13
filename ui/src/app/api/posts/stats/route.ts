import { NextRequest, NextResponse } from "next/server";
import { fetchUserByUserNameOrId } from "../../users/user.service";
import { fetchPosts } from "../post.service";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (username == null) {
    return NextResponse.json({
      success: false,
      posts: 0,
      lastPost: null,
    });
  }
  const user = await fetchUserByUserNameOrId(username);
  if (user == null) {
    return NextResponse.json({
      success: false,
      posts: 0,
      lastPost: null,
    });
  }

  const posts = await fetchPosts(user.id);

  return NextResponse.json({
    success: true,
    posts: posts?.length ?? 0,
    lastPost: posts && posts.length > 0 ? posts[0].created_at : null,
  });
}
