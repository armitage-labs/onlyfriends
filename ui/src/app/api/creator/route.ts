import { NextRequest, NextResponse } from "next/server";
import { getUserToken, verifyAuthToken } from "../untils/authentication";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: false,
  });
}

export async function POST(req: NextRequest) {
  const accessToken = getUserToken(req);
  const claims = await verifyAuthToken(accessToken);

  console.log(claims);

  // create creator

  return NextResponse.json({
    success: true,
  });
}
