import { CreateSubscriptionDto } from "@/app/types/subscriptions.dtos";
import { Invoices } from "@prisma/client";
import { fetchUserByUserNameOrId } from "../users/user.service";

export async function fetchActiveSubscription(
  creator: string,
  walletAddress: string[]
): Promise<Invoices | null> {
  const user = await fetchUserByUserNameOrId(creator);

  if (user == null) {
    return null;
  }

  const currentDate = new Date();
  return await prisma.invoices.findFirst({
    where: {
      walet_address: {
        in: walletAddress,
      },
      user_id: user.id,
      start_time: {
        lte: currentDate, // Less than or equal to current date/time
      },
      end_time: {
        gte: currentDate, // Greater than or equal to current date/time
      },
    },
  });
}

export async function fetchAllSubscription(
  username: string,
  walletAddress: string
): Promise<Invoices[] | null> {
  const user = await fetchUserByUserNameOrId(username);
  if (user == null) {
    return null;
  }
  return await prisma.invoices.findMany({
    where: {
      walet_address: walletAddress.toLocaleLowerCase(),
      user_id: user.id,
    },
  });
}

export async function fetchAllActiveSubscription(
  creator: string
): Promise<Invoices[] | null> {
  const user = await fetchUserByUserNameOrId(creator);

  if (user == null) {
    return null;
  }

  const currentDate = new Date();
  return await prisma.invoices.findMany({
    where: {
      user_id: user.id,
      start_time: {
        lte: currentDate, // Less than or equal to current date/time
      },
      end_time: {
        gte: currentDate, // Greater than or equal to current date/time
      },
    },
  });
}

export async function createActiveSubscription(
  createSubscriptionDto: CreateSubscriptionDto
): Promise<Invoices | null> {
  const user = await fetchUserByUserNameOrId(createSubscriptionDto.creator);
  if (user == null) {
    return null;
  }
  const currentDate = new Date();
  return await prisma.invoices.create({
    data: {
      user_id: user.id,
      walet_address: createSubscriptionDto.walletAddress.toLocaleLowerCase(),
      txId: createSubscriptionDto.txid,
      start_time: currentDate,
      end_time: addOneMonth(currentDate),
    },
  });
}

function addOneMonth(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}
