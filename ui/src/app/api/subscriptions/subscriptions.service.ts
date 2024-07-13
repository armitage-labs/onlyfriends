import { Invoices, Users } from "@prisma/client";

export async function fetchActiveSubscription(
  walletAddress: string[]
): Promise<Invoices | null> {
  const currentDate = new Date();
  return await prisma.invoices.findFirst({
    where: {
      walet_address: {
        in: walletAddress,
      },
      start_time: {
        lte: currentDate, // Less than or equal to current date/time
      },
      end_time: {
        gte: currentDate, // Greater than or equal to current date/time
      },
    },
  });
}
