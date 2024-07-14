import { Users } from "@prisma/client";
import prisma from "db";

export async function fetchUserByProviderId(
  providerId: string
): Promise<Users | null> {
  return await prisma.users.findFirst({
    where: {
      provider_id: providerId,
    },
  });
}

export async function fetchUserById(id: string): Promise<Users | null> {
  return await prisma.users.findFirst({
    where: {
      id: id,
    },
  });
}

export async function fetchUserByUserNameOrId(
  usernameOrId: string
): Promise<Users | null> {
  return await prisma.users.findFirst({
    where: {
      OR: [{ id: usernameOrId }, { username: usernameOrId }],
    },
  });
}
