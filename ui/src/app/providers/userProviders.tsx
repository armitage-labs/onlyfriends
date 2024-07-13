import { PrivyProvider } from '@privy-io/react-auth';

export default function UserProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="clykbmdo603o5vjv0zi5eccsp"
      config={{
        // Create embedded wallets for users who don't have a wallet
        // loginMethods: [
        //   'farcaster',
        // ],
        // loginMethodsAndOrder: []
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
