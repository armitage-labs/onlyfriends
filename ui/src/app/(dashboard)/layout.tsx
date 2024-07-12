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
    <div className="pt-3">
      <Header></Header>
      <div className="flex h-screen">
        <Sidebar />
        <main className="h-screen w-full">
          <div className="pt-6">
            {children}
          </div>
        </main>
      </div >
    </div >
  );
}
