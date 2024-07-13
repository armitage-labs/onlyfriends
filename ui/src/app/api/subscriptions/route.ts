import { CreateSubscriptionDto } from "@/app/types/subscriptions.dtos";
import { NextRequest, NextResponse } from "next/server";
import {
  createActiveSubscription,
  fetchActiveSubscription,
} from "./subscriptions.service";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  const username = req.nextUrl.searchParams.get("username");
  if (wallet == null || username == null)
    return NextResponse.json({ success: false });
  const activeSubscription = await fetchActiveSubscription(username, [
    wallet.toLocaleLowerCase(),
  ]);

  if (activeSubscription == null) {
    return NextResponse.json({
      success: false,
    });
  } else {
    return NextResponse.json({
      success: true,
      invoice: activeSubscription,
    });
  }
}

export async function POST(req: NextRequest) {
  const createSubscriptionDto = (await req.json()) as CreateSubscriptionDto;
  const invoice = await createActiveSubscription(createSubscriptionDto);
  if (invoice != null) {
    return NextResponse.json({
      success: true,
      invoice: invoice,
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }
}
