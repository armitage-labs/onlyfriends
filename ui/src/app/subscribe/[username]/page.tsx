"use client";

import { BondageCurveAbi } from "@/abis/bondageCurve";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { publicClient } from "@/utils/viemClient";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Invoices, TokenSettings, Users } from "@prisma/client";
import { encodeFunctionData } from "viem"
import axios from "axios";
import { Network, Alchemy } from "alchemy-sdk";
import { useEffect, useState } from "react";
import {
  Account,
  Chain,
  Transport,
  WalletClient,
} from "viem";
import { UsdcAbi } from "@/abis/usdc";


interface PageProps {
  params: { username: string };
}

export default function SubscriptionPage({ params }: PageProps) {
  const username = params.username;
  const [user, setUser] = useState<Users | null>(null);
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>();
  const [tokenUsdcRate, setTokenUsdcRate] = useState<string>();
  const [purchaseAmount, setPurchaseAmount] = useState<string>();
  const [activeSubscription, setActiveSubscription] = useState<Invoices>();
  const { walletConnector } = useDynamicContext();
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<string>();
  const [subscriptionPrice, setSubscriptionPrice] = useState<string>();

  const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_APIKEY || "";

  const settings = {
    apiKey: alchemyApiKey,
    network: Network.BASE_SEPOLIA // TODO from token settings
  }
  const alchemy = new Alchemy(settings);

  useEffect(() => {
    handleFetchUserDetails();
  }, []);

  useEffect(() => {
    handleFetchTokenSettings();
  }, [user]);

  useEffect(() => {
    if (tokenSettings != null) {
      handleGetCreatorTokenPrice();
    }
  }, [tokenSettings]);

  useEffect(() => {
    if (tokenSettings != null && walletConnector != null) {
      handleSwitchNetwork();
      handleFetchActiveSubscription();
      handleUserTokenBalance();
      handleGetSubscriptionPrice();
    }
  }, [tokenSettings, walletConnector]);

  const handleFetchUserDetails = async () => {
    const { data } = await axios.get(`/api/users?username=${username}`);
    if (data.success) {
      setUser(data.user);
    }
  }

  const handleFetchActiveSubscription = async () => {
    if (primaryWallet == null) return;
    const { data } = await axios.get(`/api/subscriptions?username=${username}&wallet=0x${primaryWallet.address.slice(2)}`);
    if (data.success) {
      setActiveSubscription(data.invoice);
    }
  }

  const handleCreatesSubscription = async (txid: string, creator: string, walletAddress: string) => {
    const { data } = await axios.post(`/api/subscriptions`, {
      txid: txid,
      creator: username,
      walletAddress: walletAddress,
    });
    if (data.success) {
      setActiveSubscription(data.invoice);
    }
  }

  const handleSwitchNetwork = async () => {
    if (walletConnector != null && tokenSettings != null && walletConnector.getNetwork() != null) {
      const chainIdString: string = tokenSettings.chain_id.split(":")[1];
      const chainIdNumber: number = parseInt(chainIdString);
      if (parseInt((await walletConnector.getNetwork()) as string) != chainIdNumber) {
        await walletConnector.switchNetwork({ networkChainId: chainIdNumber });
      }
    }
  }

  const handleGetCreatorTokenPrice = async () => {
    const data = await publicClient.readContract({
      address: `0x${tokenSettings?.token_address.slice(2)}`,
      abi: BondageCurveAbi,
      functionName: "calculatePurchaseReturnPrice",
      args: [1000000n]
    })
    setTokenUsdcRate(String(data));
  }

  const handleFetchTokenSettings = async () => {
    const { data } = await axios.get(`/api/token-settings?providerId=${user?.provider_id}`);
    if (data.success) {
      setTokenSettings(data.tokenSettings);
    }
  }

  const handleUserTokenBalance = async () => {
    if (primaryWallet == null) return;
    const data = await publicClient.readContract({
      address: `0x${tokenSettings?.token_address.slice(2)}`,
      abi: BondageCurveAbi,
      functionName: "balanceOf",
      args: [`0x${primaryWallet.address.slice(2)}`]
    })
    console.log("User token balance:", data);
    setUserTokenBalance(String(data));
  }

  const handleGetSubscriptionPrice = async () => {
    if (primaryWallet == null) return;
    const data = await publicClient.readContract({
      address: `0x${tokenSettings?.token_address.slice(2)}`,
      abi: BondageCurveAbi,
      functionName: "calculateSubscriptionPrice",
    })
    console.log("Subscription price in tokens:", data);
    setSubscriptionPrice(String(data));
  }

  const handlePurchaseTokens = async (usdcAmount: number) => {
    if (primaryWallet == null) return;
    const provider = await primaryWallet.connector.getSigner<WalletClient<Transport, Chain, Account>>();
    const data = encodeFunctionData({
      abi: BondageCurveAbi,
      functionName: "purchaseTokens",
      args: [BigInt(usdcAmount * 1000000)]
    })

    setIsLoading(true);
    await handleApproveUsdcAllowance();
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: `0x${primaryWallet.address.slice(2)}`,
          to: `0x${tokenSettings?.token_address.slice(2)}`,
          data: data
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log(txReceipt);
    setIsLoading(false);
  }

  const handlePurchaseSubscription = async () => {
    if (primaryWallet == null) return;
    const provider = await primaryWallet.connector.getSigner<WalletClient<Transport, Chain, Account>>();
    await handleApproveCreatorTokenAllowance();

    const data = encodeFunctionData({
      abi: BondageCurveAbi,
      functionName: "purchaseSubscription",
    });

    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: `0x${primaryWallet.address.slice(2)}`,
          to: `0x${tokenSettings?.token_address.slice(2)}`,
          data: data
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log(txReceipt);
    if (txReceipt?.transactionHash != null) {
      handleCreatesSubscription(txReceipt?.transactionHash, username, `0x${primaryWallet.address.slice(2)}`)
      console.log("Subscription purchased");
    }
  }

  const handleApproveUsdcAllowance = async () => {
    if (primaryWallet == null) return;
    const provider = await primaryWallet.connector.getSigner<WalletClient<Transport, Chain, Account>>();

    const data = encodeFunctionData({
      abi: UsdcAbi,
      functionName: "approve",
      args: [`0x${tokenSettings?.token_address.slice(2)}`, 1010000000000000n]
    })

    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: `0x${primaryWallet.address.slice(2)}`,
          to: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`, // todo need to come from config
          data: data
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log("Allowance approved");
    console.log(txReceipt);
  }

  const handleApproveCreatorTokenAllowance = async () => {
    if (primaryWallet == null) return;
    const provider = await primaryWallet.connector.getSigner<WalletClient<Transport, Chain, Account>>();
    const data = encodeFunctionData({
      abi: BondageCurveAbi,
      functionName: "approve",
      args: [`0x${tokenSettings?.token_address.slice(2)}`, 100000000000n]
    });
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: `0x${primaryWallet.address.slice(2)}`,
          to: `0x${tokenSettings?.token_address.slice(2)}`,
          data: data
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log("Content Creator token allowance approved");
    console.log(txReceipt);
  }

  return (
    <>
      {(user && tokenSettings) ? (

        <div>
          <div className="flex flex-col min-h-[100dvh]">
            <header className="bg-gray-100 dark:bg-gray-800 py-8">
              <div className="absolute top-5 right-5">
                <DynamicWidget />
              </div>
              <div className="container px-4 md:px-6 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage className="w-full h-full object-cover object-center" src={user.profile_pic || ""} />
                  <AvatarFallback>{user?.username?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{user.username || user.display_name}</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  {user.bio}
                </p>
              </div>

            </header>
            <main className="container px-4 md:px-6 py-8">

              <div className="m-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">Subscription Plan</CardTitle>
                    <Icons.heartPulse></Icons.heartPulse>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-6 text-left">
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium text-foreground">$25.00/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status</span>

                          {(activeSubscription == null) ? (
                            <span className="font-medium text-red-500">Not Subscribed</span>
                          ) : (
                            <span className="font-medium text-green-500">Active</span>
                          )}

                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Expires</span>
                          <span className="font-medium text-foreground">
                            {(activeSubscription == null) ? (
                              <>N/A</>
                            ) : (
                              <>{activeSubscription?.end_time?.toLocaleString()}</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>


                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">Bondage Curve and Pegged Token</CardTitle>
                    <Icons.coins></Icons.coins>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-6 text-left">
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Name</span>
                          <span className="font-medium text-foreground">{tokenSettings.token_name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Symbol</span>
                          <span className="font-medium text-foreground">{tokenSettings.token_symbol}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium text-green-500">${Number(1 / (Number(tokenUsdcRate) / 1000000)).toFixed(3)} USDc</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>


                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">Exclusive Content</CardTitle>
                    <Icons.rss></Icons.rss>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-6 text-left">
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Subscribers</span>
                          <span className="font-medium text-foreground">4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Number of posts</span>
                          <span className="font-medium text-foreground">23</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Last Post</span>
                          <span className="font-medium text-primary-500">{new Date(Date.now()).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>


              <div className="m-3 grid gap-4 md:grid-cols-2 lg:grid-cols-2">

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="text-xl font-semibold mb-4">Purchase Tokens</div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Your ${tokenSettings.token_symbol} Balance</span>
                    <span className="font-medium text-primary-500">{(Number(userTokenBalance) / 1000000).toFixed(3)}</span>
                  </div>
                  <div className="pt-3 flex flex-row space-x-3">

                    <Button
                      disabled={(!(purchaseAmount && Number(purchaseAmount) > 0) || primaryWallet == null)}
                      onClick={() => handlePurchaseTokens(Number(purchaseAmount))}
                    >Purchase Tokens (Input USDc amount)</Button>
                    <Input
                      type="number"
                      placeholder="Amount"
                      disabled={primaryWallet == null}
                      onChange={(event) =>
                        setPurchaseAmount(event.target.value)
                      }
                    ></Input>
                  </div>
                </div>


                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="text-xl font-semibold mb-4">Purchase Subscription</div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current subscription price</span>
                    <span className="font-medium text-primary-500">{(Number(subscriptionPrice) / 1000000).toFixed(3)} {tokenSettings.token_symbol}</span>
                  </div>
                  <Button disabled={activeSubscription != null || primaryWallet == null} onClick={() => handlePurchaseSubscription()} variant="default" className="mt-4 w-full">
                    {(activeSubscription == null) ? (
                      <>Subscribe</>
                    ) : (
                      <>Subscription Active</>
                    )}
                  </Button>
                </div>


              </div>
            </main>
          </div>
        </div>
      ) : (

        <div>
          Loading
        </div>
      )}
    </>
  );
}

