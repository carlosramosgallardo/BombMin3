// components/TokenValue.jsx
'use client';
import { useEffect, useState } from 'react';
import { BrowserProvider, formatEther } from 'ethers';

export default function TokenValue() {
  const [tokenValue, setTokenValue] = useState("0");

  useEffect(() => {
    const loadTokenValue = async () => {
      const provider = new BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(process.env.NEXT_PUBLIC_ADMIN_WALLET);
      setTokenValue(formatEther(balance));
    };

    loadTokenValue();
  }, []);

  return (
    <div className="mt-4 text-center">
      <p>Valor actual del token BombMin: <b>{tokenValue} ETH</b></p>
    </div>
  );
}