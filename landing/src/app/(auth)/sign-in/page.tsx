"use client";

import { Button } from "@/components/ui/button"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { SparklesCore } from "@/components/ui/sparkles";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import Image from "next/image"


export default function SignInPage() {
    const router = useRouter();
    const { ready, authenticated, user, login } = usePrivy();

    // const disableLogin = !ready || (ready && authenticated);

    useEffect(() => {
        if (authenticated) {
            // for some reason the styles are not being loaded if you use outer.push
            window.location.href = `/home`;
            // router.push(`/home`)
        }
    }, [ready, authenticated]);

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
