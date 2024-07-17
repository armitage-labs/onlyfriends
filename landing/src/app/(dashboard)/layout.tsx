'use client';

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { GeistSans } from "geist/font/sans";
import { cn } from '@/lib/utils';
import "../globals.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="from-primary/50 to-fuchsia-300/50 pt-5">
      <Header></Header>
      <div className="flex h-screen">
        <Sidebar />
        <main className="h-screen w-full">
          <div className="">
            {children}
          </div>
        </main>
      </div >
    </div >
  );
}
