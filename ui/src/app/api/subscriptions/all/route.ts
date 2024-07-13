import { NextRequest, NextResponse } from "next/server";
import { fetchAllActiveSubscription } from "../subscriptions.service";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (username == null) return NextResponse.json({ success: false });
  const activeSubscription = await fetchAllActiveSubscription(username);

  if (activeSubscription == null) {
    return NextResponse.json({
      success: false,
    });
  } else {
    return NextResponse.json({
      success: true,
      invoices: activeSubscription,
    });
  }
}
