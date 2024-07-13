"use client";

import LogoutButton from "../authentication/logout-button";
import WalletButton from "../authentication/wallet-button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-between">

      <div className="pl-16 items-center">
        <Image
          width={80}
          height={80}
          alt="OnlyFriends Logo"
          src={"https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/onlyfiriends-logo-ySPTXfgTqsio390klIpl1w1y1XEW9r.svg"}
        />
      </div>
      <div className="">
        <WalletButton></WalletButton>
        <LogoutButton></LogoutButton>
      </div>
    </header>
  )
}
