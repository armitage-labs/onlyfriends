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
import { Input } from "@/components/ui/input";
import axios from "axios";
import { TokenSettings } from "@prisma/client";

export default function HomePage() {

  const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_APIKEY || "";

  const settings = {
    apiKey: alchemyApiKey,
    network: Network.BASE_SEPOLIA
  }
  const alchemy = new Alchemy(settings);


  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { ready: walletReady, wallets } = useWallets();
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string>();
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>();
  const [deployedBondageCurveAddress, setDeployedBondageCurveAddress] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageInitialized, setPageInitialized] = useState<boolean>(false);
  const [tokenName, setTokenName] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>();

  const [connectedChainId, setConnectedChainId] = useState<string>();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push(`/sign-in`)
    } else if (ready && authenticated) {
      handleFetchTokenSettings();
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (walletReady) {
      console.log("Wallet", wallets);
      console.log("FILTER:", wallets.filter((wallet) => { return wallet.connectorType == "injected" }));

      setConnectedWalletAddress(wallets.find((wallet) => { return wallet.connectorType == "injected" })?.address);
      setConnectedChainId(wallets.find((wallet) => { return wallet.connectorType == "injected" })?.chainId);
      setConnectedWallet(wallets.find((wallet) => { return wallet.connectorType == "injected" }));
    }
  }, [walletReady, wallets])

  useEffect(() => {
    if (deployedBondageCurveAddress) {
      handleCreateTokenSettings();
    }
  }, [deployedBondageCurveAddress]);

  const handleCreateTokenSettings = async () => {
    const { data } = await axios.post(`/api/token-settings`, {
      providerId: user?.id,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      tokenAddress: `0x${deployedBondageCurveAddress}`,
      chainId: connectedChainId
    });
    if (data.success) {
      setTokenSettings(data.tokenSettings);
    }
  }

  const handleFetchTokenSettings = async () => {
    const { data } = await axios.get(`/api/token-settings?providerId=${user?.id}`);
    if (data.success) {
      setTokenSettings(data.tokenSettings);
    }
    setPageInitialized(true);
  }

  const handleDeployBondageCurve = async () => {
    if (!connectedWallet || !connectedWalletAddress || !tokenName || !tokenSymbol) return;
    const provider = await connectedWallet?.getEthereumProvider();

    const data = encodeFunctionData({
      abi: BondageCurveFactoryAbi,
      functionName: "deployNewBondageCurve",
      // name, symbol, treasuryAddress, usdcAddress,
      args: [tokenName, tokenSymbol, "0xCBD0DA5A02c31E504a812205089E876b5a329BB1", "0x036CbD53842c5426634e7929541eC2318f3dCF7e"]
    });



    setIsLoading(true);
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: connectedWalletAddress,
          to: "0xB211435fdfcA106088Fcd6DDf92a4eCDb3D262f7",
          data: data,
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    const deployedBondageCurve = txReceipt?.logs[1].data;
    setDeployedBondageCurveAddress(deployedBondageCurve?.slice(26));
    setIsLoading(false);
  };

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8">

      <div className="flex items-start justify-between">

        <Heading title="Bondage Curve" description="Activate and manage your bondage curve"></Heading>
      </div>

      <Separator />
      {!pageInitialized ? (
        <div>
          <Heading title="Loading..." description="Please wait while we fetch your token settings"></Heading>
        </div>
      ) : (
        <div>
          {deployedBondageCurveAddress || tokenSettings ? (

            <div>
              {`Bondage Curve deployed at address: ${tokenSettings?.token_address}`}
            </div>
          ) : (
            <div>
              <div className="pb-3">
                You have not yet created your bondage curve and your pegged token
              </div>
              <div className="flex flex-row justify-between w-1/3">

                <Input
                  type="text"
                  placeholder="Name of your Pegged token"
                  onChange={(event) =>
                    setTokenName(event.target.value)
                  }
                ></Input>

              </div>

              <div className="flex flex-row justify-between w-1/3 pt-3">

                <Input
                  type="text"
                  placeholder="Symbol of your Pegged token"
                  onChange={(event) =>
                    setTokenSymbol(event.target.value)
                  }
                ></Input>

              </div>
              <div className="pt-3">
                <Button
                  disabled={!(connectedWallet || connectedChainId) || isLoading || !tokenName || !tokenSymbol}
                  onClick={handleDeployBondageCurve}>
                  {isLoading ? "Deploying Bondage Curve..." : "Create your BondageCurve and PeggedToken!"}
                </Button>
              </div>
              <div>
              </div>
            </div>

          )}

        </div>
      )}


    </div>
  )
}
