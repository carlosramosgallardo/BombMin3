// components/ConnectWallet.jsx
'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';

export default function ConnectWallet() {
  const [wallet, setWallet] = useState(null);

  const connectWalletAndPay = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask first.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const tx = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
        value: ethers.parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)
      });

      await tx.wait();

      await supabase.from('participaciones').insert({
        wallet: userAddress,
        is_bomb: false,
        tx_hash: tx.hash,
        eth_pagado: parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)
      });

      setWallet(userAddress);
      alert("Payment confirmed. You can now play!");
    } catch (error) {
      console.error(error);
      alert("Error: " + (error.message || "Transaction rejected or failed."));
    }
  };

  return (
    <div className="mt-4">
      {wallet ? (
        <p>Connected wallet: {wallet}</p>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={connectWalletAndPay}>
          Connect MetaMask and pay 0.00001 ETH to participate in mining
        </button>
      )}
    </div>
  );
}