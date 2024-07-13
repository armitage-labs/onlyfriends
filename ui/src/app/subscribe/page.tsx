"use client";

import { useFarcasterSigner, usePrivy, } from '@privy-io/react-auth';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from "next/navigation"
import axios from 'axios';


export default function SignInPage() {
  const router = useRouter();
  const { ready, authenticated, login, user } = usePrivy();

  const disableLogin = !ready || (ready && authenticated);

  const handleUserLogin = async () => {
    const { data } = await axios.post(`/api/users`, {
      providerId: user?.id,
      fid: user?.farcaster?.fid,
      bio: user?.farcaster?.bio,
      ownerAddress: user?.farcaster?.ownerAddress,
      profileUrl: user?.farcaster?.pfp,
      displayName: user?.farcaster?.displayName,
      username: user?.farcaster?.username,
    });
    if (data.success) {
      router.push(`/home`)
    }
  };


  useEffect(() => {
    if (authenticated && user != null) {
      handleUserLogin();
    }
  }, [authenticated, user]);

  return (
    <div className="flex justify-center items-center h-screen">

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            <div className="mt-2">
              <span className="block">Powered by privy</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" disabled={disableLogin} onClick={login}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div >
  );
}
