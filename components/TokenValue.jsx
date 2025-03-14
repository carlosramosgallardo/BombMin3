// components/TokenValue.jsx
'use client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function TokenValue() {
  const [tokenValue, setTokenValue] = useState("0");

  useEffect(() => {
    const loadTokenValue = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(process.env.NEXT_PUBLIC_ADMIN_WALLET);
      setTokenValue(ethers.utils.formatEther(balance));
    };

    loadTokenValue();
  }, []);

  return (
    <div className="mt-4">
      <p>Valor actual del token BombMin: <b>{tokenValue} ETH</b></p>
    </div>
  );
}