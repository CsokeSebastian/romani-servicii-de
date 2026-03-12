import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Servicii Pentru Români în Germania | Găsește Servicii Românești',
  description: 'Directorul complet de servicii pentru comunitatea română din Germania. Găsește rapid avocați, medici, constructori, contabili și alte servicii în limba română.',
  keywords: 'servicii romani Germania, romani in Germania servicii, constructori romani Germania, avocat roman Germania, mecanici romani Germania',
  metadataBase: new URL('https://servicii-romani.de'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Servicii Pentru Români în Germania | Găsește Servicii Românești',
    description: 'Directorul complet de servicii pentru comunitatea română din Germania. Găsește rapid avocați, medici, constructori, contabili și alte servicii în limba română.',
    url: 'https://servicii-romani.de',
    siteName: 'Servicii Pentru Români în Germania',
    locale: 'ro_RO',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Servicii Pentru Români în Germania',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicii Pentru Români în Germania | Găsește Servicii Românești',
    description: 'Directorul complet de servicii pentru comunitatea română din Germania.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
