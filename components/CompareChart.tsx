'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Video { title: string; views: number }
interface Props {
  videosA: Video[]
  videosB: Video[]
  nameA: string
  nameB: string
}

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
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.5)', maxWidth: 180,
    }}>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill, flexShrink: 0 }} />
          <p style={{ color: '#9CA3AF', fontSize: 11, flex: 1 }}>{p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name}</p>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{fmt(p.value)}</p>
        </div>
      ))}
    </div>
  )
}

export default function CompareChart({ videosA, videosB, nameA, nameB }: Props) {
  const avgA = videosA.length ? Math.round(videosA.reduce((s, v) => s + v.views, 0) / videosA.length) : 0
  const avgB = videosB.length ? Math.round(videosB.reduce((s, v) => s + v.views, 0) / videosB.length) : 0
  const topA = videosA.reduce((max, v) => v.views > max ? v.views : max, 0)
  const topB = videosB.reduce((max, v) => v.views > max ? v.views : max, 0)
  const totalA = videosA.reduce((s, v) => s + v.views, 0)
  const totalB = videosB.reduce((s, v) => s + v.views, 0)

  const top5A = [...videosA].sort((a, b) => b.views - a.views).slice(0, 5)
  const top5B = [...videosB].sort((a, b) => b.views - a.views).slice(0, 5)

  const chartData = Array.from({ length: 5 }, (_, i) => ({
    name: `#${i + 1}`,
    [nameA]: top5A[i]?.views || 0,
    [nameB]: top5B[i]?.views || 0,
  }))

  const summaryStats = [
    { label: 'Avg views / video', A: avgA, B: avgB },
    { label: 'Top video', A: topA, B: topB },
    { label: 'Total views', A: totalA, B: totalB },
  ]

  const shortA = nameA.length > 10 ? nameA.slice(0, 10) + '…' : nameA
  const shortB = nameB.length > 10 ? nameB.slice(0, 10) + '…' : nameB

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}
    >
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Top 5 videos comparison</h3>
        <p style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>Best performing videos from each channel</p>
      </div>

      {/* Summary stats — responsive grid */}
      <div className="compare-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
        {summaryStats.map(s => {
          const aWins = s.A > s.B
          const bWins = s.B > s.A
          return (
            <div key={s.label} style={{
              background: '#16161F', borderRadius: 10, padding: '12px',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <p style={{ fontSize: 9, color: '#374151', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                {s.label}
              </p>
              {/* A row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: aWins ? '#FF0040' : '#2D2D3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 900, color: '#fff', flexShrink: 0 }}>A</span>
                  <span style={{ fontSize: 9, color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 52 }}>{shortA}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: aWins ? '#FF6B9D' : '#6B7280' }}>
                  {fmt(s.A)}{aWins ? ' 👑' : ''}
                </span>
              </div>
              {/* B row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: bWins ? '#3B82F6' : '#2D2D3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 900, color: '#fff', flexShrink: 0 }}>B</span>
                  <span style={{ fontSize: 9, color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 52 }}>{shortB}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: bWins ? '#60A5FA' : '#6B7280' }}>
                  {bWins ? '👑 ' : ''}{fmt(s.B)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradA2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF0040" /><stop offset="100%" stopColor="#FF6B9D" />
          </linearGradient>
          <linearGradient id="gradB2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }} barGap={3}>
          <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey={nameA} fill="url(#gradA2)" radius={[5, 5, 0, 0]} maxBarSize={32} />
          <Bar dataKey={nameB} fill="url(#gradB2)" radius={[5, 5, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: 'linear-gradient(135deg,#FF0040,#FF6B9D)', flexShrink: 0 }} />
          <span style={{ color: '#6B7280', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{nameA}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: 'linear-gradient(135deg,#3B82F6,#60A5FA)', flexShrink: 0 }} />
          <span style={{ color: '#6B7280', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{nameB}</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .compare-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}