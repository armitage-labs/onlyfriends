'use client';


import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import CreatorProviders from "../providers/creatorProviders";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CreatorProviders>
      <div className="pt-3">
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
    </CreatorProviders>
  );
}
