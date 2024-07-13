'use client';

import { Inter as FontSans } from "next/font/google"
import "../globals.css";
import { cn } from "@/lib/utils";
import UserProviders from "../providers/userProviders";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "bg-background font-sans",
        fontSans.variable
      )}>
        <UserProviders>
          {children}
        </UserProviders>
      </body>
    </html>
  );
}
