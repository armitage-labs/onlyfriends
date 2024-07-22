import PrivyProviderImpl from "@/app/providers/privy-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OnlyFriends",
  description:
    "Invest and trade your favorite Farcaster Content Creators",
  openGraph: {
    images: ["https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/Untitled%20design%20(12)-0SoWIiTCjvnouK9vosWJwJ38d72HY3.png"],
  },
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
