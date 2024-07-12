"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";

export default function LogoutButton() {
    const { ready, authenticated, logout } = usePrivy();
    const disableLogout = !ready || (ready && !authenticated);

    return (
        <Button className="rounded-full" disabled={disableLogout} onClick={logout}>
            Log out
        </Button>
    )
}