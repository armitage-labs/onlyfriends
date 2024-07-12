"use client";

import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { encodeFunctionData } from "viem"

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
    console.log("handling provider");
    if (!connectedWallet || !connectedWalletAddress) return;
    console.log("passed condition");
    const provider = await connectedWallet?.getEthereumProvider();
    const message = "This is a test message";
    const signature = await provider.request({
      method: "personal_sign",
      params: [message, connectedWalletAddress],
    })

    // const data = encodeFunctionData({});
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
