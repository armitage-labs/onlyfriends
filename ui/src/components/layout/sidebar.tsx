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
        <div className="px-3 py-0">
          <div className="">
            <div className="flex flex-col items-center">
              <Image
                width={150}
                height={150}
                alt="OnlyFriends Text Logo"
                src={"https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/text-logo-MumodmMCXKGGI3JpDeTv75ZtPpIBi8.svg"}
              />
            </div>
            <DashboardNav items={signedInNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
