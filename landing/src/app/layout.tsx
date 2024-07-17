import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans";
import { cn } from '@/lib/utils';
import './globals.css'

export const metadata: Metadata = {
  title: "OnlyFriends",
  description:
    "Invest and trade your favorite Farcaster Content Creators",
  openGraph: {
    images: ["https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/Untitled%20design%20(12)-0SoWIiTCjvnouK9vosWJwJ38d72HY3.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.className,
          "bg-gradient-to-r from-primary/50 to-fuchsia-300/50 antialiased h-full w-full"
        )}
      >
        {children}</body>
    </html>
  )
}
