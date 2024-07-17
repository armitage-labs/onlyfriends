"use client"

import PrivyProviderImpl from "@/app/providers/privy-provider";


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
