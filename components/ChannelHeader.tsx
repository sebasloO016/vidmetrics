'use client'

import { motion } from 'framer-motion'
import { Users, Eye, Film } from 'lucide-react'

interface Props {
  channel: {
    name: string
    description: string
    thumbnail: string
    subscribers: string
    totalViews: string
    videoCount: string
  }
}

function fmt(num: string) {
  const n = parseInt(num)
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

const stats = (channel: Props['channel']) => [
  {
    label: 'Subscribers',
    value: fmt(channel.subscribers),
    icon: Users,
    color: '#FF6B9D',
    bg: 'rgba(255,107,157,0.08)',
    border: 'rgba(255,107,157,0.2)',
  },
  {
    label: 'Total Views',
    value: fmt(channel.totalViews),
    icon: Eye,
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.2)',
  },
  {
    label: 'Videos',
    value: fmt(channel.videoCount),
    icon: Film,
    color: '#34D399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
  },
]

export default function ChannelHeader({ channel }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card"
      style={{ padding: 24 }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={channel.thumbnail}
            alt={channel.name}
            style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid rgba(255,0,64,0.3)', objectFit: 'cover' }}
          />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              {channel.name}
            </h2>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
              background: 'rgba(255,0,64,0.1)', color: '#FF6B9D',
              border: '1px solid rgba(255,0,64,0.2)',
              padding: '2px 8px', borderRadius: 999, flexShrink: 0,
            }}>
              YouTube
            </span>
          </div>
          <p style={{
            color: '#6B7280', fontSize: 13, lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {channel.description}
          </p>
        </div>
      </div>

      {/* Stats — responsive: 3 cols on desktop, 1 col on mobile */}
      <div className="stats-grid">
        {stats(channel).map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={{
              background: stat.bg, border: `1px solid ${stat.border}`,
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={15} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12;
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </motion.div>
  )
}
