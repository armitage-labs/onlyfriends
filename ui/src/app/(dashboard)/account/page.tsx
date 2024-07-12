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
import { publicClient } from "@/utils/viemClient";
import { BondageCurveAbi } from "@/abis/bondageCurve";
import { Input } from "@/components/ui/input";

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
  const [creatorBalanceAvailable, setCreatorBalanceAvailable] = useState<string>();
  const [subscriptionPrice, setSubscriptionPrice] = useState<string>();
  const [purchaseAmount, setPurchaseAmount] = useState<string>();

  const [connectedChainId, setConnectedChainId] = useState<string>();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push(`/sign-in`)
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (purchaseAmount) {
      console.log("Purchase amount:", purchaseAmount);
      console.log("Number Purchase amount:", Number(purchaseAmount));
    }
  }, [purchaseAmount])

  useEffect(() => {
    if (walletReady) {
      setConnectedWalletAddress(wallets[0].address);
      setConnectedChainId(wallets[0].chainId);
      setConnectedWallet(wallets[0]);
    }
  }, [walletReady, wallets])

  useEffect(() => {
    if (deployedBondageCurveAddress) {
      handleFetchCreatorBalance();
      handleGetSubscriptionPrice();
    }
  });



  const handleFetchCreatorBalance = async () => {
    const data = await publicClient.readContract({
      address: `0x${deployedBondageCurveAddress}`,
      abi: BondageCurveAbi,
      functionName: "contentCreatorBalance",
    })
    console.log("Creator balance:", data);
    setCreatorBalanceAvailable(String(data));
  }

  const handlePurchaseTokens = async (usdcAmount: number) => {
    if (!connectedWallet || !connectedWalletAddress) return;

    const provider = await connectedWallet?.getEthereumProvider();

    const data = encodeFunctionData({
      abi: BondageCurveAbi,
      functionName: "purchaseTokens",
      // args: [usdcAmount]
      args: [25n]
    })

    setIsLoading(true);
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: connectedWalletAddress,
          to: `0x${deployedBondageCurveAddress}`,
          data: data
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log(txReceipt);
  }

  const handleGetSubscriptionPrice = async () => {
    const data = await publicClient.readContract({
      address: `0x${deployedBondageCurveAddress}`,
      abi: BondageCurveAbi,
      functionName: "calculateSubscriptionPrice",
    })
    console.log("Subscription price in tokens:", data);
    setSubscriptionPrice(String(data));
  }

  const handlePurchaseSubscription = async () => {
    if (!connectedWallet || !connectedWalletAddress) return;
    const provider = await connectedWallet?.getEthereumProvider();
  }

  const handleDeployBondageCurve = async () => {
    if (!connectedWallet || !connectedWalletAddress) return;
    const provider = await connectedWallet?.getEthereumProvider();

    const data = encodeFunctionData({
      abi: BondageCurveFactoryAbi,
      functionName: "deployNewBondageCurve",
      // name, symbol, treasuryAddress, usdcAddress,
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
    setDeployedBondageCurveAddress(deployedBondageCurve?.slice(26));
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
        {deployedBondageCurveAddress ? (
          <div>
            {`Bondage Curve deployed at address: 0x${deployedBondageCurveAddress}`}
            <div>Balance to Withdrawal: {creatorBalanceAvailable}</div>
            <div>Subscription Price in creator tokens: {subscriptionPrice} USDC</div>
            <div className="pt-3 flex flex-row space-x-3">
              <Button
                disabled={!(purchaseAmount && Number(purchaseAmount) > 0) || isLoading}
                onClick={() => handlePurchaseTokens(Number(purchaseAmount))}
              >Purchase Tokens</Button>
              <Input
                type="number"
                placeholder="Amount"
                onChange={(event) =>
                  setPurchaseAmount(event.target.value)
                }
              ></Input>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
