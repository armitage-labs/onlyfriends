'use client';

import { Inter as FontSans } from "next/font/google"
import Providers from "./providers/providers";
import "./globals.css";
import { cn } from "@/lib/utils";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
