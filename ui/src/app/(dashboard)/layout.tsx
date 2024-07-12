import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "OnlyFriends",
    description: "Create you gated content",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const thing = "";
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}