// components/ConnectWallet.jsx
'use client';
import { useState } from 'react';
import { BrowserProvider, parseEther } from 'ethers';
import { supabase } from '@/lib/supabase';

export default function ConnectWallet() {
  const [wallet, setWallet] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const connectWalletAndPay = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask first.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const tx = {
        to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
        value: parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE),
      };

      // Estimar el gas antes de enviar la transacción
      const estimatedGas = await provider.estimateGas(tx);
      tx.gasLimit = estimatedGas;

      const txResponse = await signer.sendTransaction(tx);
      setTxHash(txResponse.hash);
      setWallet(userAddress);

      alert("Transaction submitted. Please approve it in MetaMask.");
    } catch (error) {
      console.error(error);
      alert("Error: " + (error.message || "Transaction rejected or failed."));
    }
  };

  return (
    <div className="mt-4 text-center">
      {wallet ? (
        <div>
          <p>Connected wallet: {wallet}</p>
          {txHash && <p>Transaction pending: {txHash}</p>}
        </div>
      ) : (
        <button className="bg-blue-500 text-white px-6 py-3 rounded text-lg" onClick={connectWalletAndPay}>
          Connect MetaMask & Pay 0.00001 ETH
        </button>
      )}
    </div>
  );
}