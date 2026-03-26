# VidMetrics — YouTube Competitor Analysis Tool

Premium SaaS-style web app to analyze any YouTube channel's video performance instantly.

## Features

- Paste any YouTube channel URL → instant competitor analysis
- Channel stats: subscribers, total views, video count
- Performance bar chart (top 10 videos, gradient bars)
- Full video table: views, likes, comments, engagement rate
- 🔥 Trending indicators on above-average videos
- Sorting: most viewed, liked, commented, engagement, latest
- Search/filter videos
- CSV export (navbar + table)
- Skeleton loading state
- Framer Motion entrance animations
- Responsive design, dark mode

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Recharts
- Framer Motion
- Lucide React
- YouTube Data API v3

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add `NEXT_PUBLIC_YOUTUBE_API_KEY` in Environment Variables
4. Deploy
