"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";

export default function PostsPage() {
    const router = useRouter();
    const { ready, authenticated } = usePrivy();

    useEffect(() => {
        if (ready && !authenticated) {
            router.push(`/sign-in`)
        }
    }, [ready, authenticated]);

    return (
        <div className="flex flex-col h-screen justify-center items-center">

            <h3 className="text-2xl font-bold tracking-tight">
                Looks like you haven't posted anything yet!
            </h3>
            <p className="text-sm text-muted-foreground">
                Afraid of commitment, are we? 😜
            </p>
            <Button className="mt-4 rounded-full">Create your first post</Button>
        </div>
    )
}
