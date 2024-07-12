import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "OnlyFriends",
  description: "Create you gated content",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header></Header>
        <Sidebar></Sidebar>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          {children}
        </main>
      </div >
    </div >
  );
}
