import { Chain, createPublicClient, http } from "viem";

export function publicClient(chain: Chain) {
  return createPublicClient({
    chain: chain,
    transport: http(),
  });
}
