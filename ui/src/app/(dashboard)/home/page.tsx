"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation"

export default function HomePage() {
    const router = useRouter();
    const { ready, authenticated, login } = usePrivy();

    useEffect(() => {
        if (ready && !authenticated) {
            router.push(`/sign-in`)
        }
    }, [ready, authenticated]);

    return (
        <div className="flex justify-center items-center h-screen">

            Home! Welcome
        </div >
    );
}