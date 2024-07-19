import PrivyProviderImpl from "@/app/providers/privy-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OnlyFriends Waitlist",
  description:
    "Get on the OnlyFriends waitlist now, so you can be the first to trade your favorite creator. Don't miss out!",
  keywords: ["invest", "personal tokens", "tokens"],
  openGraph: {
    url: "https://www.onlyfriends.tech",
    title: "OnlyFriends Waitlist",
    images: ["https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/coming%20soon%20(1)-agjPBjlfcqJPK7tHqGSEmSyIS2LnEh.png"],
    description:
      "Get on the OnlyFriends waitlist now, so you can be the first to trade your favorite creator. Don't miss out!",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlyFriends Waitlist",
    images: "https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/coming%20soon%20(1)-agjPBjlfcqJPK7tHqGSEmSyIS2LnEh.png"
  }
};


export default function WaitlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivyProviderImpl loginMethods={['wallet']}>
      {children}
    </PrivyProviderImpl>
  );
}
