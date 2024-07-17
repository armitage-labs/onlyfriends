"use client";

// import WalletButton from "../authentication/wallet-button";
import Image from "next/image";
import LogoutButton from "../authentication/logout-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-end">
      <div className="">
        {/* <WalletButton></WalletButton> */}
        <LogoutButton></LogoutButton>
      </div>
    </header>
  )
}
