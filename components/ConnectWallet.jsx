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

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const transactionParameters = {
        to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
        value: ethers.utils.parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)._hex,
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      await supabase.from('participaciones').insert({
        wallet: userAddress,
        is_bomb: false,
        tx_hash: txHash,
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