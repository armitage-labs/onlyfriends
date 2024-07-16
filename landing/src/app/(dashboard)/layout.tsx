'use client';

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import "../globals.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
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
