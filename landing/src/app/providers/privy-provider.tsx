"use client";

import { PrivyProvider } from '@privy-io/react-auth';

type PrivyProviderProps = {
  loginMethods: Array<'wallet' | 'email' | 'sms' | 'google' | 'twitter' | 'discord' | 'github' | 'linkedin' | 'spotify' | 'instagram' | 'tiktok' | 'apple' | 'farcaster' | 'telegram'>;
};

export default function PrivyProviderImpl({ children, loginMethods }: { children: React.ReactNode } & PrivyProviderProps) {
  return (
    <PrivyProvider
      appId="clyin8r9k006dal2imtv1194z"
      config={{
        loginMethods: loginMethods,
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
