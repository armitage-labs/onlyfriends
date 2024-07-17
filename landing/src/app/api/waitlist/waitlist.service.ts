import prisma from "db";
import { CreateWaitlistEntryRequest } from "../types/waitlist.types";

export async function createWaitlistEntry(
  waitlistEntryRequest: CreateWaitlistEntryRequest,
): Promise<boolean> {
  await prisma.waitlist.create({
    data: {
      email: waitlistEntryRequest.email,
      wallet: waitlistEntryRequest.wallet,
    },
  });
  return true;
}
