import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Create your account",
};

export default function PublicLayout({
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