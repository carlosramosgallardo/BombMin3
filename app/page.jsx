// app/page.jsx
'use client';
import ConnectWallet from '@/components/ConnectWallet';
import TokenValue from '@/components/TokenValue';
import Board from '@/components/Board';
import '@/app/globals.css';

export default function Home() {
  return (
    <main className="p-6 min-h-screen flex flex-col items-center justify-center text-lg">
      <h1 className="text-4xl font-bold mb-6">BombMin3</h1>
      <ConnectWallet />
      <TokenValue />
      <Board />
    </main>
  );
}
