'use client'

import { Download, Play } from 'lucide-react'

interface Props {
  videos?: any[]
  hasData: boolean
}

function exportCSV(videos: any[]) {
  const headers = ['Rank', 'Title', 'Views', 'Likes', 'Comments', 'Engagement', 'Duration', 'Published']
  const eng = (v: any) => v.views ? (((v.likes + v.comments) / v.views) * 100).toFixed(2) + '%' : '0%'
  const dur = (iso: string) => {
    const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!m) return '-'
    const h = m[1] ? m[1] + ':' : ''
    return `${h}${m[2]?.padStart(h ? 2 : 1, '0') || '0'}:${m[3]?.padStart(2, '0') || '00'}`
  }
  const rows = videos.map((v, i) => [
    i + 1,
    `"${(v.title ?? '').replace(/"/g, '""')}"`,
    v.views ?? 0,
    v.likes ?? 0,
    v.comments ?? 0,
    eng(v),
    dur(v.duration),
    new Date(v.publishedAt).toLocaleDateString('en-US'),
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'vidmetrics-export.csv'
  a.click()
}

export default function Navbar({ videos, hasData, onReset }: Props & { onReset?: () => void }) {
  return (
    <nav className="glass" style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 56, display: 'flex', alignItems: 'center',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1100, width: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Logo — clickable, returns to home */}
        <button
          onClick={onReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, transition: 'opacity 200ms ease',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #FF0040, #FF6B9D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Play size={13} fill="white" color="white" />
          </div>
          <span className="gradient-text" style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>
            VidMetrics
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            background: 'rgba(255,0,64,0.12)', color: '#FF6B9D',
            border: '1px solid rgba(255,0,64,0.25)',
            padding: '2px 8px', borderRadius: 999,
            textTransform: 'uppercase',
          }}>
            BETA
          </span>
        </button>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {hasData && videos && (
            <button
              onClick={() => exportCSV(videos)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9CA3AF', borderRadius: 10,
                padding: '6px 14px', fontSize: 13, cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                ;(e.currentTarget as HTMLElement).style.color = '#fff'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = '#9CA3AF'
              }}
            >
              <Download size={14} />
              <span className="hide-mobile">Export CSV</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
