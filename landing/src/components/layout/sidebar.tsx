"use client";
import { cn } from "@/lib/utils";

import { signedInNavItems } from "./navItems";
import Image from "next/image";
import { DashboardNav } from "../ui/dashboard-nav";

export default function Sidebar() {
  return (
    <nav
      className={cn(`w-72`)}
    >
      <div className="">
        <div className="px-3 py-0">
          <div className="">
            <div className="flex flex-col items-center pt-5 pb-5">
              <Image
                width={150}
                height={150}
                alt="OnlyFriends Text Logo"
                src={"https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/onlyfiriends-logo-ySPTXfgTqsio390klIpl1w1y1XEW9r.svg"}
              />
            </div>
            <DashboardNav items={signedInNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
