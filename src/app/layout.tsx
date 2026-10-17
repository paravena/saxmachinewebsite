import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SITE_URL } from '../lib/site';
import '../styles/globals.css';

const TITLE = 'Sax Machine — Saxophone Duo · Live Music for Cruise Lines and Events';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description:
    'Sax Machine: professional saxophone duo (Jonathan Gatica & Felipe Vidal) for cruise lines, private events, and celebrations. Jazz, lounge, pop, and Latin rhythms.',
  authors: [{ name: 'Sax Machine' }],
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'Sax Machine',
    locale: 'en_US',
    alternateLocale: ['es_CL'],
    title: TITLE,
    description:
      'Professional saxophone duo (Jonathan Gatica & Felipe Vidal) for cruise lines, private events, and celebrations. Jazz, lounge, pop, and Latin rhythms.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'Professional saxophone duo (Jonathan Gatica & Felipe Vidal) for cruise lines, private events, and celebrations.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
