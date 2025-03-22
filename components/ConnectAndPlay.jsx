'use client';

import { useEffect, useState } from 'react';
import {
  createWeb3Modal,
  useWeb3Modal,
} from '@web3modal/wagmi/react';
import {
  WagmiConfig,
  createConfig,
  useAccount,
  useConnect,
  useWalletClient,
  http,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { BrowserProvider, parseEther } from 'ethers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';

const queryClient = new QueryClient();
const chains = [mainnet];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
  },
});

createWeb3Modal({ wagmiConfig, projectId, chains });

function ConnectAndPlayContent({ gameCompleted, gameData }) {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: walletClient } = useWalletClient();
  const [statusMessage, setStatusMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handleMobileConnect = () => {
    const walletConnect = connectors.find(c => c.id === 'walletConnect');
    if (walletConnect) {
      connect({ connector: walletConnect });
    } else {
      open(); // fallback
    }
  };

  const handlePay = async () => {
    if (!isConnected || !address) {
      setStatusMessage('Please connect your wallet first.');
      return;
    }

    if (!gameCompleted || !gameData) {
      setStatusMessage('❌ Please complete a play before paying.');
      return;
    }

    const { error } = await supabase.from('games').insert([gameData]);
    if (error) {
      setStatusMessage('Failed to save your game. Payment cancelled.');
      return;
    }

    try {
      setIsPaying(true);
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
        value: parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE),
      });

      setStatusMessage('🟢 Game saved and payment sent!');
    } catch (err) {
      setStatusMessage('Transaction cancelled or failed.');
    } finally {
      setIsPaying(false);
    }
  };

  const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);

  return (
    <div className="text-center my-4 space-y-4">
      {!isConnected ? (
        <button
          onClick={isAndroid ? handleMobileConnect : open}
          className="px-4 py-2 mt-2 ml-2 rounded bg-black text-white hover:bg-gray-900 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handlePay}
          disabled={isPaying}
          className={`px-4 py-2 mt-2 ml-2 rounded transition ${
            isPaying
              ? 'bg-gray-600 cursor-not-allowed text-white'
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          {isPaying ? 'Processing...' : 'Power up MM with your donation!'}
        </button>
      )}

      {statusMessage && (
        <p className="text-sm text-red-500 mt-2">{statusMessage}</p>
      )}
    </div>
  );
}

export default function ConnectAndPlay(props) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectAndPlayContent {...props} />
      </QueryClientProvider>
    </WagmiConfig>
  );
}
