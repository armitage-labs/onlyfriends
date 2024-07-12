"use client";

import { WalletWithMetadata, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { LinkedAccountWithMetadata } from "@privy-io/server-auth";

export default function WalletButton() {
    const [linkedWallet, setLinkedWallet] = useState<WalletWithMetadata>();
    const { ready, authenticated, user, linkWallet } = usePrivy();
    const disableLogout = !ready || (ready && !authenticated);


    useEffect(() => {
        if (user != null) {
            // setLinkedAccounts(user.linkedAccounts)
        }
    }, [user]);

    return (
        <Button variant={'outline'} className="rounded-full" disabled={disableLogout} onClick={linkWallet}>
            Link Wallet
        </Button>
    )
}