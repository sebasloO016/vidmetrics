'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import ChannelInput from '@/components/ChannelInput'
import ChannelHeader from '@/components/ChannelHeader'
import VideoTable from '@/components/VideoTable'
import PerformanceChart from '@/components/PerformanceChart'
import InsightsBar from '@/components/InsightsBar'
import SkeletonLoader from '@/components/SkeletonLoader'
import ErrorState from '@/components/ErrorState'

// Floating metric card
function FloatingCard({ style, label, value, color, delay }: {
  style?: React.CSSProperties
  label: string
  value: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: color, flexShrink: 0,
        boxShadow: `0 0 8px ${color}`,
      }} />
      <div>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{value}</p>
        <p style={{ color: '#4B5563', fontSize: 10, marginTop: 3 }}>{label}</p>
      </div>
    </motion.div>
  )
}

// Animated background grid
function GridBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,0,64,0.06) 0%, transparent 70%)',
      }} />
      {/* Grid lines */}
      <svg
        width="100%" height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.15 }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Fade out at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(to bottom, transparent, #0A0A0F)',
      }} />
    </div>
  )
}

// Typing animation for the word "competitor"
function TypingText() {
  const words = ['competitor', 'rival', 'channel', 'creator']
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const current = words[index]
    if (!deleting && displayed.length < current.length) {
      timeout.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === current.length) {
      timeout.current = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex(i => (i + 1) % words.length)
    }
    return () => { if (timeout.current) clearTimeout(timeout.current) }
  }, [displayed, deleting, index])

  return (
    <span className="gradient-text" style={{ display: 'inline-block', minWidth: 180 }}>
      {displayed}
      <span style={{
        display: 'inline-block', width: 3, height: '0.85em',
        background: 'linear-gradient(135deg,#FF0040,#FF6B9D)',
        marginLeft: 2, verticalAlign: 'middle', borderRadius: 2,
        animation: 'blink 1s step-end infinite',
      }} />
    </span>
  )
}

// Social proof row
function SocialProof() {
  const items = [
    { icon: '📊', text: 'Real-time metrics' },
    { icon: '⚡', text: 'Instant analysis' },
    { icon: '📈', text: 'Trending indicators' },
    { icon: '📋', text: 'CSV export' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, flexWrap: 'wrap', marginTop: 32,
      }}
    >
      {items.map((item, i) => (
        <span key={i} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 999, padding: '5px 12px',
          fontSize: 12, color: '#6B7280',
        }}>
          <span style={{ fontSize: 11 }}>{item.icon}</span>
          {item.text}
        </span>
      ))}
    </motion.div>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const handleAnalyze = async (url: string) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`/api/youtube?channelUrl=${encodeURIComponent(url)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong')
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setData(null); setError(null) }

  return (
    <main style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <Navbar videos={data?.videos} hasData={!!data} onReset={handleReset} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── HERO ── */}
        <AnimatePresence>
          {!data && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'relative',
                textAlign: 'center',
                paddingTop: 100, paddingBottom: 64,
                overflow: 'visible',
              }}
            >
              <GridBackground />

              {/* Floating metric cards — desktop only */}
              <div className="floating-cards">
                <FloatingCard
                  label="Avg views / video"
                  value="84.2M"
                  color="#60A5FA"
                  delay={0.8}
                  style={{ left: -20, top: 80 }}
                />
                <FloatingCard
                  label="Engagement rate"
                  value="4.8%"
                  color="#34D399"
                  delay={1.0}
                  style={{ left: -40, top: 200 }}
                />
                <FloatingCard
                  label="Top video views"
                  value="719.6M"
                  color="#FF6B9D"
                  delay={0.9}
                  style={{ right: -20, top: 80 }}
                />
                <FloatingCard
                  label="Shorts vs Videos"
                  value="Shorts win"
                  color="#FBBF24"
                  delay={1.1}
                  style={{ right: -40, top: 200 }}
                />
              </div>

              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,0,64,0.08)', border: '1px solid rgba(255,0,64,0.2)',
                  color: '#FF6B9D', fontSize: 12, fontWeight: 600,
                  padding: '6px 14px', borderRadius: 999, marginBottom: 32,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  position: 'relative', zIndex: 1,
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#FF0040',
                  display: 'inline-block', animation: 'pulse 2s infinite',
                }} />
                Live YouTube Data
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  fontSize: 'clamp(36px, 6vw, 62px)',
                  fontWeight: 800, lineHeight: 1.08,
                  letterSpacing: '-0.03em', marginBottom: 24,
                  color: '#fff', position: 'relative', zIndex: 1,
                }}
              >
                Analyze any YouTube<br />
                <TypingText />
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  color: '#6B7280', fontSize: 18, maxWidth: 480,
                  margin: '0 auto 44px', lineHeight: 1.65,
                  position: 'relative', zIndex: 1,
                }}
              >
                Paste a competitor's channel URL and instantly see which videos are crushing it — views, engagement, trends and more.
              </motion.p>

              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <ChannelInput onAnalyze={handleAnalyze} loading={loading} />
              </motion.div>

              {/* Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                style={{ color: '#374151', fontSize: 12, marginTop: 14, position: 'relative', zIndex: 1 }}
              >
                Supports: @handle · /channel/ID · /c/name · /user/name
              </motion.p>

              <SocialProof />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact input when results shown */}
        {(data || loading) && (
          <div style={{ paddingTop: 32, paddingBottom: 32 }}>
            <ChannelInput onAnalyze={handleAnalyze} loading={loading} compact />
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ErrorState message={error} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton */}
        {loading && <SkeletonLoader />}

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <ChannelHeader channel={data.channel} />
              <PerformanceChart videos={data.videos} />
              <InsightsBar videos={data.videos} channelName={data.channel.name} />
              <VideoTable videos={data.videos} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .floating-cards { pointer-events: none; }
        @media (max-width: 900px) {
          .floating-cards { display: none; }
        }
      `}</style>
    </main>
  )
}
