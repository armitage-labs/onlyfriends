import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../../untils/authentication";
import { fetchPost, fetchPostFrames } from "../post.service";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({
      success: false,
    });
  }

  const post = await fetchPost(id);
  const postFrame = await fetchPostFrames(id);

  if (post == null || postFrame == null) {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    post: post,
    frame: postFrame,
  });
}
