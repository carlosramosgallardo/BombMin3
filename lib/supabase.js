// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// app/page.jsx
'use client';
import ConnectWallet from '@/components/ConnectWallet';
import TokenValue from '@/components/TokenValue';
import Board from '@/components/Board';

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Juego BombMin3</h1>
      <ConnectWallet />
      <TokenValue />
      <Board />
    </main>
  );
}