// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'DevFlow - AI-Powered PR Description Generator',
  description:
    'Generate intelligent pull request descriptions using AI analysis of your code diffs. Save time and improve your development workflow with smart automation.',
  keywords: [
    'PR',
    'Pull Request',
    'AI',
    'GitHub',
    'Development',
    'Code Review',
    'Automation',
    'DevOps',
  ],
  authors: [{ name: 'Vijay', url: 'https://github.com/vijaynvvr' }],
  creator: 'DevFlow',
  publisher: 'DevFlow',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'DevFlow - AI-Powered PR Description Generator',
    description:
      'Generate intelligent pull request descriptions using AI analysis of your code diffs. Save time and improve your development workflow.',
    url: '/',
    siteName: 'DevFlow',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'DevFlow - AI-Powered PR Description Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFlow - AI-Powered PR Description Generator',
    description:
      'Generate intelligent pull request descriptions using AI analysis of your code diffs.',
    images: ['/api/og'],
    creator: '@vijaynvvr',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
