import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VidMetrics — YouTube Competitor Analysis',
  description: 'Analyze any YouTube channel and instantly see which videos are crushing it.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
