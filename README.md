# VidMetrics — YouTube Competitor Analysis Tool

A premium SaaS-style web app to analyze any YouTube channel's video performance instantly. Built for enterprise creators and media agencies.

---

## Live Demo

> Add your Netlify URL here once deployed

## Features

- **Channel analysis** — paste any YouTube channel URL and get instant insights
- **50 videos** fetched and analyzed per search
- **Key metrics** — views, likes, comments, engagement rate per video
- **Performance chart** — top 10 videos visualized with gradient bar chart
- **Insights bar** — best posting time, Shorts vs Videos comparison, copy report
- **Shorts / Videos filter** — separate and compare content formats
- **Date range filter** — 7d / 30d / 90d / All time
- **Sort** — by most viewed, liked, commented, engagement, or latest
- **Search** — filter videos by title
- **Video preview** — hover thumbnail to play inline without leaving the app
- **Trending indicators** — 🔥 HOT badge on above-average videos
- **Pagination** — 25 videos per page with prev/next navigation
- **CSV export** — download full report with all metrics
- **Copy report** — one-click text summary for Slack or email
- **Responsive design** — mobile-first, works on all screen sizes
- **Immersive hero** — animated typing effect, floating metric cards, grid background

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **Animations** — Framer Motion
- **Charts** — Recharts
- **Icons** — Lucide React
- **Data** — YouTube Data API v3
- **Deploy** — Netlify

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/sebasloO016/vidmetrics.git
cd vidmetrics
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env.local` file

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and add your YouTube Data API v3 key:

```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

> **How to get a YouTube API key:**
> 1. Go to [console.cloud.google.com](https://console.cloud.google.com)
> 2. Create a new project
> 3. Enable **YouTube Data API v3**
> 4. Go to Credentials → Create API Key
> 5. Restrict the key to YouTube Data API v3 only

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy on Netlify

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → Add new site → Import from GitHub
3. Select the `vidmetrics` repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variable:
   - Key: `NEXT_PUBLIC_YOUTUBE_API_KEY`
   - Value: your API key
6. Click **Deploy**

---

## Project Structure

```
vidmetrics/
├── app/
│   ├── api/
│   │   └── youtube/
│   │       └── route.ts        # YouTube API handler
│   ├── globals.css             # Global styles + design tokens
│   ├── layout.tsx              # Root layout + metadata + favicon
│   └── page.tsx                # Main page + hero + results
├── components/
│   ├── ChannelHeader.tsx       # Channel stats card
│   ├── ChannelInput.tsx        # URL input with YouTube icon
│   ├── ErrorState.tsx          # Error UI
│   ├── InsightsBar.tsx         # Best time, Shorts vs Videos, copy report
│   ├── Navbar.tsx              # Sticky nav + logo + export CSV
│   ├── PerformanceChart.tsx    # Recharts bar chart
│   ├── SkeletonLoader.tsx      # Loading skeleton
│   └── VideoTable.tsx          # Full video table with all filters
├── public/
│   └── favicon.svg
├── .env.local.example
├── .gitignore
└── README.md
```

---

## Build Approach

Built using AI-assisted development (Cursor + Claude) to move fast while maintaining clean, production-quality code. The entire product was designed and shipped in under 4 days.

Key decisions:
- **Next.js App Router** for clean API route separation
- **Client-side pagination** — no extra API calls, instant page switching
- **CSS-in-JS via inline styles** for full design control without Tailwind conflicts
- **Framer Motion** for entrance animations and video preview modal
- **YouTube Data API v3** — single 50-result call, no quota waste

---

## API Usage

The app uses 3 YouTube Data API v3 endpoints per search:

| Endpoint | Purpose | Quota cost |
|---|---|---|
| `search.list` | Find channel ID by handle | 100 units |
| `channels.list` | Get channel stats | 1 unit |
| `search.list` | Get top 50 video IDs | 100 units |
| `videos.list` | Get stats for all videos | 1 unit |

**Total per search: ~202 units** out of 10,000 daily free quota.