// app/page.jsx
'use client';
import ConnectWallet from '@/components/ConnectWallet';
import TokenValue from '@/components/TokenValue';
import Board from '@/components/Board';

export default function Home() {
  return (
    <main className="p-6 bg-black text-white font-mono min-h-screen">
      <h1 className="text-2xl font-bold">BombMin3</h1>
      <ConnectWallet />
      <TokenValue />
      <Board />
    </main>
  );
}