'use client'

import { motion } from 'framer-motion'
import { Users, Eye, Film, Trophy } from 'lucide-react'

interface Channel {
  name: string
  description: string
  thumbnail: string
  subscribers: string
  totalViews: string
  videoCount: string
}
interface Props { channelA: Channel; channelB: Channel }

function parseNum(s: string) { return parseInt(s) || 0 }
function fmt(n: string) {
  const v = parseNum(n)
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + 'B'
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M'
  if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K'
  return v.toString()
}

function WinnerBadge({ wins }: { wins: number }) {
  if (wins === 0) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)',
      color: '#FBBF24', fontSize: 10, fontWeight: 700,
      padding: '2px 7px', borderRadius: 999, marginLeft: 6, flexShrink: 0,
    }}>
      <Trophy size={9} />{wins}W
    </span>
  )
}

export default function CompareHeader({ channelA, channelB }: Props) {
  const metrics = [
    { label: 'Subscribers', icon: Users, vA: channelA.subscribers, vB: channelB.subscribers },
    { label: 'Total Views', icon: Eye, vA: channelA.totalViews, vB: channelB.totalViews },
    { label: 'Videos', icon: Film, vA: channelA.videoCount, vB: channelB.videoCount },
  ]

  const winsA = metrics.filter(m => parseNum(m.vA) > parseNum(m.vB)).length
  const winsB = metrics.filter(m => parseNum(m.vB) > parseNum(m.vA)).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' }}
    >
      {/* Channel name row */}
      <div className="compare-channels-row" style={{ display: 'grid', gridTemplateColumns: '1fr 52px 1fr' }}>
        {/* Channel A */}
        <div style={{ padding: '18px 20px', background: 'rgba(255,0,64,0.03)', borderRight: '1px solid rgba(255,0,64,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={channelA.thumbnail} alt={channelA.name}
                style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid rgba(255,0,64,0.4)', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute', bottom: -3, right: -3,
                width: 16, height: 16, borderRadius: '50%',
                background: '#FF0040', border: '2px solid #111118',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 900, color: '#fff',
              }}>A</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                  {channelA.name}
                </p>
                <WinnerBadge wins={winsA} />
              </div>
              <p style={{ fontSize: 10, color: '#4B5563', marginTop: 2 }}>Channel A</p>
            </div>
          </div>
        </div>

        {/* VS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,0,64,0.04)' }}>
          <span style={{
            fontSize: 11, fontWeight: 900, letterSpacing: '0.1em',
            background: 'linear-gradient(135deg,#FF0040,#60A5FA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>VS</span>
        </div>

        {/* Channel B */}
        <div style={{ padding: '18px 20px', background: 'rgba(96,165,250,0.03)', borderLeft: '1px solid rgba(96,165,250,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row-reverse' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={channelB.thumbnail} alt={channelB.name}
                style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid rgba(96,165,250,0.4)', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute', bottom: -3, left: -3,
                width: 16, height: 16, borderRadius: '50%',
                background: '#3B82F6', border: '2px solid #111118',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 900, color: '#fff',
              }}>B</span>
            </div>
            <div style={{ minWidth: 0, textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 4 }}>
                <WinnerBadge wins={winsB} />
                <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                  {channelB.name}
                </p>
              </div>
              <p style={{ fontSize: 10, color: '#4B5563', marginTop: 2 }}>Channel B</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics rows */}
      {metrics.map((m) => {
        const vA = parseNum(m.vA)
        const vB = parseNum(m.vB)
        const total = vA + vB || 1
        const pctA = (vA / total) * 100
        const pctB = (vB / total) * 100
        const aWins = vA > vB
        const bWins = vB > vA
        const Icon = m.icon

        return (
          <div key={m.label} className="compare-metric-row" style={{
            display: 'grid', gridTemplateColumns: '1fr 52px 1fr',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}>
            {/* A value */}
            <div style={{
              padding: '12px 20px',
              background: aWins ? 'rgba(255,0,64,0.04)' : 'transparent',
              borderRight: '1px solid rgba(255,255,255,0.04)',
            }}>
              <p style={{ fontSize: 'clamp(14px,3vw,18px)', fontWeight: 800, color: aWins ? '#FF6B9D' : '#9CA3AF', letterSpacing: '-0.02em', marginBottom: 6 }}>
                {fmt(m.vA)}{aWins && <span style={{ marginLeft: 5, fontSize: 11 }}>👑</span>}
              </p>
              <div style={{ height: 3, width: '100%', maxWidth: 100, background: '#1E1E2E', borderRadius: 99 }}>
                <div style={{ height: '100%', borderRadius: 99, width: `${pctA}%`, background: 'linear-gradient(90deg,#FF0040,#FF6B9D)', transition: 'width 0.8s ease' }} />
              </div>
            </div>

            {/* Center label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#1E1E2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={11} color="#4B5563" />
              </div>
              <p style={{ fontSize: 8, color: '#374151', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>
                {m.label}
              </p>
            </div>

            {/* B value */}
            <div style={{
              padding: '12px 20px',
              background: bWins ? 'rgba(96,165,250,0.04)' : 'transparent',
              borderLeft: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            }}>
              <p style={{ fontSize: 'clamp(14px,3vw,18px)', fontWeight: 800, color: bWins ? '#60A5FA' : '#9CA3AF', letterSpacing: '-0.02em', marginBottom: 6 }}>
                {bWins && <span style={{ marginRight: 5, fontSize: 11 }}>👑</span>}{fmt(m.vB)}
              </p>
              <div style={{ height: 3, width: '100%', maxWidth: 100, background: '#1E1E2E', borderRadius: 99 }}>
                <div style={{ height: '100%', borderRadius: 99, width: `${pctB}%`, background: 'linear-gradient(90deg,#3B82F6,#60A5FA)', transition: 'width 0.8s ease', marginLeft: 'auto' }} />
              </div>
            </div>
          </div>
        )
      })}

      <style>{`
        @media (max-width: 480px) {
          .compare-channels-row { grid-template-columns: 1fr 36px 1fr !important; }
          .compare-metric-row { grid-template-columns: 1fr 36px 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}