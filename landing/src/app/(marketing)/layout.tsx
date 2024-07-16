import type { Metadata } from "next";
import "../globals.css";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "OnlyFriends",
  description:
    "Invest and trade your favorite content creators",
  openGraph: {
    images: ["https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/logo-with-text-sOnqDTsKFHSkmsrGeenkodbxLtlqR2.svg"],
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
