"use client";

import { PrivyProvider } from '@privy-io/react-auth';

export default function PrivyProviderImpl({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId="clyin8r9k006dal2imtv1194z"
            config={{
                loginMethods: [
                    'farcaster',
                    'email',
                    'wallet'
                ],
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}