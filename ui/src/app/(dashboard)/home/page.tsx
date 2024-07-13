"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import axios from "axios";
import { TokenSettings } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { publicClient } from "@/utils/viemClient";
import { BondageCurveAbi } from "@/abis/bondageCurve";

export default function HomePage() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const [pageInitialized, setPageInitialized] = useState<boolean>(false);
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>();
  const [contentCreatorBalanceAvailable, setCreatorBalanceAvailable] = useState<string>();
  const [activeSubscriptionCount, setActiveSubscriptionCount] = useState<number>();
  const [tokenUsdcRate, setTokenUsdcRate] = useState<string>();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push(`/sign-in`)
    } else if (ready && authenticated) {
      handleFetchTokenSettings();
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (tokenSettings) {
      handleFetchCreatorBalance();
      handleFetchActiveSubscriptionCount();
      handleGetCreatorTokenPrice();
    }
  }, [tokenSettings]);

  const handleFetchTokenSettings = async () => {
    const { data } = await axios.get(`/api/token-settings?providerId=${user?.id}`);
    if (data.success) {
      setTokenSettings(data.tokenSettings);
    }
    setPageInitialized(true);
  }

  const handleFetchActiveSubscriptionCount = async () => {
    const { data } = await axios.get(`/api/invoices?providerId=${user?.id}`);
    if (data.success) {
      setActiveSubscriptionCount(data.activeSubscriptionCount);
    }
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

  const handleGetCreatorTokenPrice = async () => {
    const data = await publicClient.readContract({
      address: `0x${tokenSettings?.token_address.slice(2)}`,
      abi: BondageCurveAbi,
      functionName: "calculatePurchaseReturnPrice",
      args: [1000000n]
    })
    setTokenUsdcRate(String(data));
  }

  return (
    <>

      <div className="flex-1 space-y-4  p-4 md:p-8">

        <div className="flex items-start justify-between">

          <Heading title="Dashboard" description="View the most important info about your Pegged Token and your Bondage Curve"></Heading>
        </div>

        <Separator />

        {!pageInitialized ? (
          <div className="pt-16 text-center items-center">
            <Heading title="Loading..." description="Please wait while we fetch your settings"></Heading>
          </div>
        ) : (
          <div>
            {!tokenSettings ? (
              <div className="m-5">

                <Alert>
                  <Icons.messageCircleHeart className="mr-2 h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    You haven't created a Bondage Curve and a Pegged Token yet.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="m-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Number of Subscribers</CardTitle>
                    <Icons.heartPulse></Icons.heartPulse>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {activeSubscriptionCount}
                    </div>
                    <div className="flex justify-between">
                      <p className="pt-1 text-xs text-muted-foreground">
                        Current active subscribers
                      </p>
                    </div>
                  </CardContent>
                </Card>


                <Card>
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
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{tokenSettings.token_name}</CardTitle>
                    <Icons.coins></Icons.coins>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      1 {tokenSettings.token_symbol} = {Number(1 / (Number(tokenUsdcRate) / 1000000)).toFixed(3)} USDc
                    </div>
                    <div className="flex justify-between">
                      <p className="pt-1 text-xs text-muted-foreground">
                        Your personal token value
                      </p>
                    </div>
                  </CardContent>
                </Card>

              </div>
            )}
          </div>
        )
        }

      </div>
    </>
  )
}
