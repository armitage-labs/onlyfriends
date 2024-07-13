"use client";

import { WalletWithMetadata, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function WalletButton() {
    const [linkedWallet, setLinkedWallet] = useState<WalletWithMetadata>();
    const { ready, authenticated, user, linkWallet } = usePrivy();
    const disableLinkWallet = !ready || (ready && !authenticated) || linkedWallet != null;

    /**
     * TODO move to util
     */
    const truncateMiddle = (str: string, firstChars: number, lastChars: number) => {
        if (str.length <= firstChars + lastChars) {
            return str;
        }
        const startChars = str.slice(0, firstChars);
        const endChars = str.slice(-lastChars);

        return `${startChars}...${endChars}`;
    };


    useEffect(() => {
        if (user != null) {
            const walletAccount = user.linkedAccounts.find(account => account.type === 'wallet' && account.connectorType == 'injected');
            setLinkedWallet(walletAccount as WalletWithMetadata);
        }
    }, [user]);

    return (
        <Button variant={'outline'} className="rounded-full" disabled={disableLinkWallet} onClick={linkWallet}>
            {linkedWallet == null ? (
                <>
                    Link Wallet
                </>
            ) : (
                <>
                    {truncateMiddle(linkedWallet.address, 4, 4)} Connected
                </>
            )}
        </Button>
    )
}