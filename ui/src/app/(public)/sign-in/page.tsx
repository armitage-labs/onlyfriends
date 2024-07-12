"use client";

import { usePrivy } from '@privy-io/react-auth';
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
    const { ready, authenticated, login } = usePrivy();
    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    const handleUserLogin = async () => {
        const { data } = await axios.post(`/api/creator`);
        router.push(`/home`)
    };


    useEffect(() => {
        if (authenticated) {
            handleUserLogin();
        }
    }, [authenticated]);

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