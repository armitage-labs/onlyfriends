import { PrivyProvider } from '@privy-io/react-auth';
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function UserProviders({ children }: { children: React.ReactNode }) {
  return (

    <DynamicContextProvider
      settings={{
        environmentId: '6f19c952-e142-4ffa-bbca-8746fff8c4ac',
        walletConnectors: [EthereumWalletConnectors],
      }}>
      {children}
    </DynamicContextProvider>
  );
}
