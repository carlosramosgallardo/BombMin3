'use client';
import { useState } from 'react';

export default function Footer() {
  const [revealed, setRevealed] = useState(false);

  return (
    <footer className="text-center text-sm text-gray-400 mt-12 mb-4">
      <p>Follow us on:</p>
      <div className="flex justify-center gap-4 mt-2 text-blue-500 underline">
        <a href="https://www.youtube.com/@FreakingAI" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="https://www.tiktok.com/@freakingai" target="_blank" rel="noopener noreferrer">TikTok</a>
        <a href="https://www.instagram.com/freakingai" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://x.com/freakingai" target="_blank" rel="noopener noreferrer">X</a>
      </div>
      <p className="mt-4">
        📧 Contact:{' '}
        {!revealed ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setRevealed(true);
            }}
            className="underline text-blue-400"
          >
            Show email
          </a>
        ) : (
          <a
            href="mailto:botsandpods@gmail.com"
            className="underline text-blue-400"
          >
            botsandpods@gmail.com
          </a>
        )}
      </p>
    </footer>
  );
}
