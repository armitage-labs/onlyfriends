import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId="clyin8r9k006dal2imtv1194z"
            config={{
                // Create embedded wallets for users who don't have a wallet
                loginMethods: [
                    'farcaster'
                ],
                // embeddedWallets: {
                //     createOnLogin: 'users-without-wallets',
                // },
            }}
        >
            {children}
        </PrivyProvider>
    );
}