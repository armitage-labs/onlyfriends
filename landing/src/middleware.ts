import { NextResponse, NextRequest } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_TOKEN_SECRET!
);

const authenticated = ["/home"];

export async function middleware(request: NextRequest) {
  try {
    // if you are accessing an authenticated we check that you have a valid privy token
    const accessToken = request.cookies.get("privy-token")?.value ?? "";
    if (authenticated.includes(request.nextUrl.pathname)) {
      const verifiedClaims = await privy.verifyAuthToken(accessToken);
      if (!verifiedClaims) {
        request.cookies.delete("privy-token");
        return NextResponse.redirect(new URL("/sign-out", request.url));
      }
    }
  } catch (e) {
    request.cookies.delete("privy-token");
    return NextResponse.redirect(new URL("/sign-out", request.url));
  }
  return NextResponse.next();
}
