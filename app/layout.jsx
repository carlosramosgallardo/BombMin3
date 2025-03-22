import './globals.css';
import Script from 'next/script';
import Footer from '@/components/Footer'; 

export const metadata = {
  title: 'MathsMine3',
  description: 'Solve fast to mine! A fake Web3 mining game where your speed changes everything.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1022737864838438" />
      </head>
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1022737864838438"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {children}

        <Footer />
      </body>
    </html>
  );
}
