"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { useEffect } from "react";

export default function WalletButton() {
    const { ready, authenticated, user, linkWallet } = usePrivy();
    const disableLogout = !ready || (ready && !authenticated);


    useEffect(() => {
        if (user != null) {
            console.log(user.linkedAccounts);
        }
    }, [user]);

    return (
        <Button variant={'outline'} className="rounded-full" disabled={disableLogout} onClick={linkWallet}>
            Link Wallet
        </Button>
    )
}