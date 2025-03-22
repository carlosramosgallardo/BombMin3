'use client';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import ConnectAndPlay from '@/components/ConnectAndPlay';
import Board from '@/components/Board';
import Leaderboard from '@/components/Leaderboard';
import TokenChart from '@/components/TokenChart';
import '@/app/globals.css';
import Image from 'next/image';

export default function Home() {
  const [account, setAccount] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem('account');
    if (savedAccount) {
      setAccount(savedAccount);
    }

    // Cargar anuncio
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    <>
      <Head>
        <title>MathsMine3</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mathsmine3.xyz/" />
        <meta property="og:image" content="/MM.jpg" />
        <meta property="og:site_name" content="MathsMine3" />
        <meta property="og:title" content="MathsMine3" />
        <meta property="og:description" content="Solve fast to Mine" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@FreakingAI" />
        <meta name="twitter:title" content="MathsMine3" />
        <meta name="twitter:description" content="Solve fast to Mine" />
        <meta name="twitter:image" content="/MM.jpg" />
      </Head>

      <main className="flex flex-col items-center min-h-screen w-full p-4 text-lg font-mono overflow-hidden">
        {process.env.NEXT_PUBLIC_GA_ENABLED === 'true' && (
          <GoogleAnalytics
            trackPageViews
            gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}

        <div className="flex justify-center mb-4">
          <Image src="/MM.jpg" alt="MM" width={240} height={240} className="rounded-full" />
        </div>

        <ConnectAndPlay
          account={account}
          setAccount={setAccount}
          gameCompleted={gameCompleted}
          gameData={gameData}
        />

        <div className="text-center mt-6 max-w-lg text-sm">
          <p className="mb-1">Solve fast to Mine!</p>
        </div>

        <Board
          account={account}
          setGameMessage={setGameMessage}
          setGameCompleted={setGameCompleted}
          setGameData={setGameData}
        />

        {gameMessage && (
          <div className="text-yellow-400 font-bold text-center mt-4 whitespace-pre-line">
            {gameMessage}
          </div>
        )}
        <div className="w-full max-w-lg mt-6">
          <TokenChart />
        </div>

        <Leaderboard itemsPerPage={10} />

        <div className="mt-12 w-full max-w-sm aspect-[9/16]">
        <iframe
          className="w-full h-full rounded-xl shadow-lg"
          src="https://www.youtube.com/embed/08jfpGlzeeg"
          title="MathsMine3.XYZ"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      </main>
    </>
  );
}
