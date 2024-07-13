"use client";

import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
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
import { publicClient } from "@/utils/viemClient";
import { BondageCurveAbi } from "@/abis/bondageCurve";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { UsdcAbi } from "@/abis/usdc";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";

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
  const [contentCreatorBalanceAvailable, setCreatorBalanceAvailable] = useState<string>();
  const [purchaseAmount, setPurchaseAmount] = useState<string>();

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

  useEffect(() => {
    handleFetchCreatorBalance();
  }, [tokenSettings]);

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


  const handleFetchCreatorBalance = async () => {
    if (!tokenSettings) return;
    const data = await publicClient.readContract({
      address: `0x${tokenSettings?.token_address.slice(2)}`,
      abi: BondageCurveAbi,
      functionName: "contentCreatorBalance",
    })
    console.log("Creator balance:", data);
    setCreatorBalanceAvailable(String(data));
  }

  const handleApproveUsdcAllowance = async () => {
    if (!connectedWallet || !connectedWalletAddress) return;

    const provider = await connectedWallet?.getEthereumProvider();

    const data = encodeFunctionData({
      abi: UsdcAbi,
      functionName: "approve",
      // args: [usdcAmount]
      //101000000
      args: [`0x${tokenSettings?.token_address.slice(2)}`, 1010000000000000n]
    })

    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: connectedWalletAddress,
          to: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`,
          data: data
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log("Allowance approved");
    console.log(txReceipt);
  }

  const handlePurchaseTokens = async (usdcAmount: number) => {
    if (!connectedWallet || !connectedWalletAddress) return;

    const provider = await connectedWallet?.getEthereumProvider();

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
          from: connectedWalletAddress,
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

  const handleWithdrawContentCreatorBalance = async () => {
    if (!connectedWallet || !connectedWalletAddress) return;
    const provider = await connectedWallet?.getEthereumProvider();

    const data = encodeFunctionData({
      abi: BondageCurveAbi,
      functionName: "creatorBalanceWithdrawal",
    })

    setIsLoading(true);
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: connectedWalletAddress,
          to: `0x${tokenSettings?.token_address.slice(2)}`,
          data: data
        }
      ]
    });
    await alchemy.core.waitForTransaction(transactionHash);
    const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log(txReceipt);
    setIsLoading(false);
  };

  const handleDeployBondageCurve = async () => {
    console.log("entered");
    if (!connectedWallet || !connectedWalletAddress || !tokenName || !tokenSymbol) return;
    console.log("passed")
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

  const chartData = [
    { bonded: "1", price: 1 },
    { bonded: "10", price: 5 },
    { bonded: "20", price: 10 },
    { bonded: "30", price: 15 },
    { bonded: "40", price: 20 },
    { bonded: "50", price: 25 },
  ]

  const chartConfig = {
    desktop: {
      label: "bonded",
      color: "#2563eb",
    },
  } satisfies ChartConfig

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

              <div className="m-5">

                <Alert>
                  <Icons.messageCircleHeart className="mr-2 h-4 w-4" />
                  <AlertTitle>You have been pegged!</AlertTitle>
                  <AlertDescription>
                    <div>
                      <Link
                        href={`https://base-sepolia.blockscout.com/address/${tokenSettings?.token_address}`}
                      >
                        {`Bondage Curve ${tokenSettings?.token_name} ${tokenSettings?.token_symbol} deployed at address: ${tokenSettings?.token_address}`}
                      </Link>
                    </div>


                  </AlertDescription>
                </Alert>
              </div>


              <div className="m-3 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="m-3">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                    <Icons.piggyBank></Icons.piggyBank>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Number(contentCreatorBalanceAvailable) / 1000000} USDc
                    </div>
                    <div className="flex justify-between">

                      <p className="pt-1 text-xs text-muted-foreground">
                        Available for withdrawal immediately
                      </p>
                      <Button
                        onClick={() => { console.log("clicked"); handleWithdrawContentCreatorBalance() }}
                      >Withdrawal</Button>
                    </div>
                  </CardContent>
                </Card>


                <Card className="m-3">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Purchase Your Pegged tokens</CardTitle>
                    <Icons.coins></Icons.coins>
                  </CardHeader>
                  <CardContent>

                    <div className="pt-3 flex flex-row space-x-3">
                      <Button
                        disabled={!(purchaseAmount && Number(purchaseAmount) > 0) || isLoading}
                        onClick={() => handlePurchaseTokens(Number(purchaseAmount))}
                      >Purchase Tokens (Input USDc amount)</Button>
                      <Input
                        type="number"
                        placeholder="Amount"
                        onChange={(event) =>
                          setPurchaseAmount(event.target.value)
                        }
                      ></Input>
                    </div>

                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Bondage Curve - {tokenSettings?.token_symbol} Price</CardTitle>
                  <CardDescription>{tokenSettings?.token_name} price in USDc </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <LineChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="bonded"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line
                        dataKey="price"
                        type="linear"
                        stroke="var(--color-desktop)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none">
                    Bondage Curve increases the token price linearly <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing the price of {tokenSettings?.token_symbol} in USDc per tokens minted
                  </div>
                </CardFooter>
              </Card>

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
