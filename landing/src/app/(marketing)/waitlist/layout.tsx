import PrivyProviderImpl from "@/app/providers/privy-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OnlyFriends",
  description:
    "Invest and trade your favorite Farcaster Content Creators",
  openGraph: {
    images: ["https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/coming%20soon%20(1)-agjPBjlfcqJPK7tHqGSEmSyIS2LnEh.png"],
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
