import { NextRequest, NextResponse } from "next/server";
import { CreateWaitlistEntryRequest } from "../types/waitlist.types";
import { createWaitlistEntry } from "./waitlist.service";

export async function POST(req: NextRequest) {
  const waitlistEntry = (await req.json()) as CreateWaitlistEntryRequest;
  if (!waitlistEntry)
    return NextResponse.json({ success: false });

  const waitlistEntryCreated = await createWaitlistEntry(waitlistEntry);
  return NextResponse.json({ success: waitlistEntryCreated });
}
