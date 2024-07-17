"use client";

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { SparklesCore } from "@/components/ui/sparkles";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import axios from 'axios';


export default function SignInPage() {

    const { ready, authenticated, user, login, logout } = usePrivy();

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
            // router.push(`/home`)
        }
    };


    useEffect(() => {
        if (authenticated && user != null) {
            handleUserLogin();
        }
    }, [authenticated, user]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={1.5}
                    maxSize={5}
                    particleDensity={30}
                    className="w-full h-full"
                    particleColor="#FF00FF"
                />
            </div>
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900">
                <Image
                    width={400}
                    height={400}
                    alt="OnlyFriends Text Logo"
                    src={"https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/logo-with-text-sOnqDTsKFHSkmsrGeenkodbxLtlqR2.svg"}
                />

                <div className="flex flex-row justify-between">
                    <Button className="flex items-center space-x-1 mt-4 font-bold w-full m-2" onClick={login}>
                        <span className="text-center">Sign In</span>
                    </Button>
                </div>
            </BackgroundGradient>
        </div>
    )
}
