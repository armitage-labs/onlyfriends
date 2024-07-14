import { Network, Alchemy } from "alchemy-sdk";
import {
  Chain,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  sepolia,
} from "viem/chains";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_APIKEY || "";

export interface ChainConfig {
  name: string;
  network: Network;
  chain: Chain;
  explorerUrl: string;
  usdcAddress: string;
  bondageEnabled: boolean;
  bondageCurveFactoryAddress?: string;
}

export function getAlchemyClient(chainId: number) {
  const alchemy = new Alchemy({
    apiKey: alchemyApiKey,
    network: chainConfigs[chainId].network,
  });
  return alchemy;
}

export const chainConfigs: { [chainId: number]: ChainConfig } = {
  1: {
    name: "Ethereum Mainnet",
    network: Network.ETH_MAINNET,
    chain: mainnet,
    explorerUrl: "https://eth.blockscout.com",
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    bondageEnabled: false,
  },
  11155111: {
    name: "Ethereum Sepolia",
    network: Network.ETH_SEPOLIA,
    chain: sepolia,
    explorerUrl: "https://eth-sepolia.blockscout.com",
    usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    bondageEnabled: false,
  },
  8453: {
    name: "Base",
    network: Network.BASE_MAINNET,
    chain: base,
    explorerUrl: "https://base.blockscout.com",
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    bondageEnabled: false,
  },
  84532: {
    name: "Base Sepolia",
    network: Network.BASE_SEPOLIA,
    chain: baseSepolia,
    explorerUrl: "https://base-sepolia.blockscout.com",
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    bondageEnabled: true,
    bondageCurveFactoryAddress: "0x6be62d751671a2974AebEc4Ff240C5A8BcF77633",
  },
  42161: {
    name: "Arbitrum One",
    network: Network.ARB_MAINNET,
    chain: arbitrum,
    explorerUrl: "https://arbitrum.blockscout.com",
    usdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    bondageEnabled: false,
  },
  421614: {
    name: "Arbitrum Sepolia",
    chain: arbitrumSepolia,
    network: Network.ARB_SEPOLIA,
    explorerUrl: "https://arbitrum-sepolia.blockscout.com",
    usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    bondageEnabled: true,
    bondageCurveFactoryAddress: "0x9BA85d1Abc5cE9b12b54825944e145a5c6ceb4E9",
  },
};
