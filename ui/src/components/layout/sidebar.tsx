"use client";
import { cn } from "@/lib/utils";
import { DashboardNav } from "../ui/dashboard-nav";
import { signedInNavItems } from "./navItems";
import Image from "next/image";

export default function Sidebar() {
  return (
    <nav
      className={cn(`border-r lg:block w-72`)}
    >
      <div className="">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <div className="flex flex-col items-center">
              <Image
                width={80}
                height={80}
                alt="OnlyFriends Logo"
                src={"https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/onlyfiriends-logo-ySPTXfgTqsio390klIpl1w1y1XEW9r.svg"}
              />
              <h2 className="mb-2 px-4 text-2xl font-semibold tracking-tight pb-4">
                OnlyFriends
              </h2>
            </div>
            <DashboardNav items={signedInNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
