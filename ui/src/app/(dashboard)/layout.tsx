import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/layout/navbar";
import Header from "@/components/layout/header";

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
            <Navbar></Navbar>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header></Header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                    {children}
                </main>
            </div >
        </div >
    );
}