"use client";

import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { Network, Alchemy } from "alchemy-sdk";
import { encodeFunctionData } from "viem"
import { BondageCurveFactoryAbi } from "@/abis/bondageCurveFactory";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function HomePage() {

  const settings = {
    apiKey: "oCc1sE76h91d0-STTYmZTBk77xgTA1rR",
    network: Network.BASE_SEPOLIA
  }
  const alchemy = new Alchemy(settings);


  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { ready: walletReady, wallets } = useWallets();
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string>();
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>();
  const [deployedBondageCurveAddress, setDeployedBondageCurveAddress] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleDeployBondageCurve = async () => {
    if (!connectedWallet || !connectedWalletAddress) return;
    const provider = await connectedWallet?.getEthereumProvider();

    const data = encodeFunctionData({
      abi: BondageCurveFactoryAbi,
      functionName: "deployNewBondageCurve",
      args: ["GabBondageToken", "GBT", "0xCBD0DA5A02c31E504a812205089E876b5a329BB1", "0x036CbD53842c5426634e7929541eC2318f3dCF7e"]
    });



    setIsLoading(true);
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
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    const deployedBondageCurve = txReceipt?.logs[1].data;
    console.log("Bondage Curve deployed at address: ", "0x" + deployedBondageCurve?.slice(26));
    setDeployedBondageCurveAddress("0x" + deployedBondageCurve?.slice(26));
    setIsLoading(false);
  };

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8">

      <div className="flex items-start justify-between">

        <Heading title="Account" description="Activate and manage your account"></Heading>
      </div>

      <Separator />
      <div>
        You have not yet activated your account
      </div>
      <Button
        disabled={!(connectedWallet || connectedChainId) || isLoading}
        onClick={handleDeployBondageCurve}>
        {isLoading ? "Deploying Bondage Curve..." : "Activate and deploy your Bondage Curve!"}
      </Button>
      <div>
        {deployedBondageCurveAddress ? `Bondage Curve deployed at address: ${deployedBondageCurveAddress}` : null}
      </div>
    </div>
  )
}
