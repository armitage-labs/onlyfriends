import type { Metadata } from "next";
import "../globals.css";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "OnlyFriends",
  description:
    "Invest and trade your favorite content creators",
  keywords: ["invest", "personal tokens", "tokens"],
  openGraph: {
    url: "https://www.onlyfriends.tech",
    title: "OnlyFriends",
    images: ["https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/logo-with-text-sOnqDTsKFHSkmsrGeenkodbxLtlqR2.svg"],
    description:
      "Invest and trade your favorite content creators",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlyFriends",
    images: "https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/coming%20soon%20(1)-agjPBjlfcqJPK7tHqGSEmSyIS2LnEh.png"
  }
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
