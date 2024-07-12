"use client";

import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { encodeFunctionData } from "viem"
import { BondageCurveFactoryAbi } from "@/abis/bondageCurveFactory";

export default function HomePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { ready: walletReady, wallets } = useWallets();
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string>();
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>();

  const [connectedChainId, setConnectedChainId] = useState<string>();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push(`/sign-in`)
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (walletReady) {
      setConnectedWalletAddress(wallets[0].address);
      setConnectedChainId(wallets[0].chainId);
      setConnectedWallet(wallets[0]);
    }
  }, [walletReady, wallets])

  useEffect(() => {
    if (connectedWallet && connectedChainId) {
      handleGetProviderFromWallet();
    }
  }, [connectedChainId, connectedWalletAddress]);

  const handleGetProviderFromWallet = async () => {
    if (!connectedWallet || !connectedWalletAddress) return;
    const provider = await connectedWallet?.getEthereumProvider();
    const message = "This is a test message";

    const data = encodeFunctionData({
      abi: BondageCurveFactoryAbi,
      functionName: "deployNewBondageCurve",
      args: ["GabBondageToken", "GBT", "0xCBD0DA5A02c31E504a812205089E876b5a329BB1", "0x036CbD53842c5426634e7929541eC2318f3dCF7e"]
    });


    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: connectedWalletAddress,
          to: "0x9BA85d1Abc5cE9b12b54825944e145a5c6ceb4E9",
          data: data,
        }
      ]
    });
    console.log("FINISHED:");
    console.log(transactionHash);
  };

  return (
    <div className="pl-6 pt-20">
      Account page
      <div>
        You have not yet activated your account
      </div>
      <div>
        Activate your account and create your own personal token using the Bondage Curve
      </div>
      <div>
        You are connected to {connectedWalletAddress} on chainID: {connectedChainId}</div>
    </div>
  )
}
