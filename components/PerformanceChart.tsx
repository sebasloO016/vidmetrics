'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

interface Video { title: string; views: number; likes: number; comments: number }
interface Props { videos: Video[] }

function fmt(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1A1A27', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '12px 16px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
      maxWidth: 200,
    }}>
      <p style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 6, lineHeight: 1.4 }}>
        {payload[0].payload.title}
      </p>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
        {fmt(payload[0].value)}
        <span style={{ color: '#6B7280', fontWeight: 400, fontSize: 12 }}> views</span>
      </p>
    </div>
  )
}

export default function PerformanceChart({ videos }: Props) {
  const top10 = [...videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map((v, i) => ({
      ...v,
      shortTitle: v.title.length > 20 ? v.title.slice(0, 20) + '…' : v.title,
      rank: i,
    }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="card"
      style={{ padding: 24 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
          Performance overview
        </h3>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Top 10 videos by views</p>
      </div>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF0040" />
            <stop offset="100%" stopColor="#FF6B9D" />
          </linearGradient>
          <linearGradient id="barGradientMuted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E2E3E" />
            <stop offset="100%" stopColor="#1E1E2E" />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={top10} margin={{ top: 4, right: 4, left: 4, bottom: 64 }}>
          <XAxis
            dataKey="shortTitle"
            tick={{ fill: '#4B5563', fontSize: 11, fontFamily: 'Inter, system-ui' }}
            angle={-35}
            textAnchor="end"
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: '#4B5563', fontSize: 11, fontFamily: 'Inter, system-ui' }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="views" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {top10.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.rank === 0 ? 'url(#barGradient)' : 'url(#barGradientMuted)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
