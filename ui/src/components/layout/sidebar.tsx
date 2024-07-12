"use client";
import { cn } from "@/lib/utils";
import { DashboardNav } from "../ui/dashboard-nav";
import { signedInNavItems } from "./navItems";

export default function Sidebar() {
  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-2xl font-semibold tracking-tight pb-4">
              OnlyFriends
            </h2>
            <DashboardNav items={signedInNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
