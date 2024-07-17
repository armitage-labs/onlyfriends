"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation"

export default function LogoutButton() {
    const router = useRouter();

    const logout = () => {
        // for some reason the styles are not being loaded if you use outer.push
        window.location.href = 'sign-out';
        // router.push('sign-out');
    };

    return (
        <Button className="rounded-full bg-neutral-900 hover:bg-primary/90:hover  text-white" onClick={logout}>
            Log out
        </Button>
    )
}