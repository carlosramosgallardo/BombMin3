// components/SendPayment.jsx
'use client';
import { ethers } from "ethers";
import { supabase } from '@/lib/supabase';

export default function SendPayment({ wallet, isBomb }) {
  const sendPayment = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
      value: ethers.utils.parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)
    });

    await tx.wait();

    await supabase.from('participaciones').insert({
      wallet,
      is_bomb: isBomb,
      tx_hash: tx.hash,
      eth_pagado: parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE)
    });

    alert("Pago y participación registrados, puedes jugar ahora!");
  };

  return (
    <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={sendPayment}>
      Pagar 0.00001 ETH para jugar
    </button>
  );
}