import prisma from "db";
import { NextRequest, NextResponse } from "next/server";
import { fetchUserByProviderId } from "../users/user.service";

export async function GET(req: NextRequest) {
  const providerId = req.nextUrl.searchParams.get("providerId");

  if (providerId == null) return NextResponse.json({ success: false });
  const user = await fetchUserByProviderId(providerId);

  if (user == null || user?.id == null) {
    return NextResponse.json({
      success: false
    });
  }
  const activeSubscriptionCount = await getCurrentActiveSubscriptions(user.id);

  if (activeSubscriptionCount == undefined) {
    return NextResponse.json({
      success: false
    });
  } else {
    return NextResponse.json({
      success: true,
      activeSubscriptionCount: activeSubscriptionCount
    })
  }
}

async function getCurrentActiveSubscriptions(userId: string): Promise<number> {
  return await prisma.invoices.count({
    where: {
      user_id: userId,
      end_time: {
        gte: new Date(Date.now())
      }
    }
  })
}
