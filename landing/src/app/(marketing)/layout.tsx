import type { Metadata } from "next";
import "../globals.css";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
