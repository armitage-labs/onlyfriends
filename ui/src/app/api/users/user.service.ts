import { Users } from "@prisma/client";

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
