import { NextRequest, NextResponse } from "next/server";
import { fetchAllSubscription } from "../../subscriptions/subscriptions.service";

export async function GET(
  req: NextRequest,
  { params: { wallet } }: { params: { wallet: string } }
) {
  const username = req.nextUrl.searchParams.get("username");
  if (username == null) return NextResponse.json({ success: false });

  const invoices = await fetchAllSubscription(username, wallet);

  return NextResponse.json({
    success: true,
    invoices: invoices,
  });
}
