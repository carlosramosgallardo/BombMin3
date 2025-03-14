// components/ConnectWallet.jsx
'use client';
import { useState } from 'react';
import { ethers } from 'ethers';

export default function ConnectWallet() {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Instala MetaMask primero.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    setWallet(accounts[0]);
  };

  return (
    <div className="mt-4">
      {wallet ? (
        <p>Wallet conectada: {wallet}</p>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={connectWallet}>
          Conectar MetaMask
        </button>
      )}
    </div>
  );
}