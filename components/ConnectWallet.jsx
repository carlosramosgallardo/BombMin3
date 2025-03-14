// components/ConnectWallet.jsx
'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';

export default function ConnectWallet() {
  const [wallet, setWallet] = useState(null);

  const connectWalletAndPay = async () => {
    if (!window.ethereum) return alert("Please install MetaMask first.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
      value: ethers.utils.parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)
    });

    await tx.wait();

    await supabase.from('participaciones').insert({
      wallet: accounts[0],
      is_bomb: false,
      tx_hash: tx.hash,
      eth_pagado: parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)
    });

    setWallet(accounts[0]);
    alert("Payment confirmed. You can now play!");
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