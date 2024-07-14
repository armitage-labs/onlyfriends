export interface ChainConfig {
  name: string;
  explorerUrl: string;
}

export const chainConfigs: { [chainId: number]: ChainConfig } = {
  1: {
    name: "Ethereum Mainnet",
    explorerUrl: "https://eth.blockscout.com",
  },
  11155111: {
    name: "Ethereum Sepolia",
    explorerUrl: "https://eth-sepolia.blockscout.com",
  },
  8453: {
    name: "Base",
    explorerUrl: "https://base.blockscout.com",
  },
  84532: {
    name: "Base Sepolia",
    explorerUrl: "https://base-sepolia.blockscout.com",
  },
  42161: {
    name: "Arbitrum One",
    explorerUrl: "https://arbitrum.blockscout.com",
  },
  421614: {
    name: "Arbitrum Sepolia",
    explorerUrl: "https://arbitrum.blockscout.com",
  },
};
