"use client";

import { BondageCurveAbi } from "@/abis/bondageCurve";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { publicClient } from "@/utils/viemClient";
import { TokenSettings, Users } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";


interface PageProps {
  params: { username: string };
}

export default function SubscriptionPage({ params }: PageProps) {
  const username = params.username;
  const [user, setUser] = useState<Users | null>(null);
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>();
  const [tokenUsdcRate, setTokenUsdcRate] = useState<string>();

  useEffect(() => {
    handleFetchUserDetails();
  }, []);

  useEffect(() => {
    handleFetchTokenSettings();
  }, [user]);

  useEffect(() => {
    handleGetCreatorTokenPrice();
  }, [tokenSettings]);

  const handleFetchUserDetails = async () => {
    const { data } = await axios.get(`/api/users?username=${username}`);
    if (data.success) {
      setUser(data.user);
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

  return (
    <>
      {(user && tokenSettings) ? (

        <div>

          <div className="flex flex-col min-h-[100dvh]">
            <header className="bg-gray-100 dark:bg-gray-800 py-8">
              <div className="container px-4 md:px-6 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user.profile_pic || ""} />
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
                          <span className="text-muted-foreground">Plan</span>
                          <span className="font-medium text-foreground">Frend</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium text-foreground">$25.00/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium text-green-500">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Expires</span>
                          <span className="font-medium text-foreground">
                            {new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() + 1)).toLocaleString()}
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
                          <span className="font-medium text-green-500">${(Number(tokenUsdcRate) / 1000000)} USDc</span>
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Subscription Type</div>
                      {/* <Badge>Pro</Badge> */}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Renewal Date</div>
                      <div className="text-sm">2024-12-31</div>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-row space-x-3">
                    <Button
                    // disabled={!(purchaseAmount && Number(purchaseAmount) > 0) || isLoading}
                    // onClick={() => handlePurchaseTokens(Number(purchaseAmount))}
                    >Purchase Tokens (Input USDc amount)</Button>
                    <Input
                      type="number"
                      placeholder="Amount"
                    // onChange={(event) =>
                    //   setPurchaseAmount(event.target.value)
                    // }
                    ></Input>
                  </div>
                </div>


                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="text-xl font-semibold mb-4">Purchase Subscription</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Subscription Type</div>
                      {/* <Badge>Pro</Badge> */}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Expiry Date</div>
                      <div className="text-sm">
                        {new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() + 1)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="default" className="mt-4 w-full">
                    Subscribe
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

