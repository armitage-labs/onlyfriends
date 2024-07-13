import { AuthTokenClaims, PrivyClient } from "@privy-io/server-auth";
import { NextRequest } from "next/server";

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_TOKEN_SECRET!
);

export function isAuthenticated(req: NextRequest): boolean {
  const token = getUserToken(req);
  if (token == null) {
    return false;
  }
  const claims = verifyAuthToken(token);
  if (claims != null) {
    return true;
  } else {
    return false;
  }
}

export async function isAuthenticated2(req: NextRequest) {
  const token = getUserToken(req);
  const claims = await verifyAuthToken(token!);
  // console.log(claims);
}

export function getUserToken(req: NextRequest): string | undefined {
  return req.cookies.get("privy-token")?.value;
}

export async function verifyAuthToken(
  authToken: string
): Promise<AuthTokenClaims | null> {
  if (authToken == null) {
    return null;
  }
  try {
    return await privy.verifyAuthToken(authToken);
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`);
    return null;
  }
}
