'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, Swords } from 'lucide-react'

interface Props {
  onCompare: (url1: string, url2: string) => void
  loading: boolean
}

export default function CompareInput({ onCompare, loading }: Props) {
  const [url1, setUrl1] = useState('')
  const [url2, setUrl2] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url1.trim() && url2.trim()) onCompare(url1.trim(), url2.trim())
  }

  const YTIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#FF0040"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  )

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Channel A */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: 8,
            background: 'rgba(255,0,64,0.15)', border: '1px solid rgba(255,0,64,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#FF6B9D',
          }}>A</span>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: '#1A1A27', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '8px 12px',
            transition: 'border-color 200ms',
          }}
            onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,64,0.4)'}
            onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <YTIcon />
            <input
              type="text" value={url1} onChange={e => setUrl1(e.target.value)}
              placeholder="https://youtube.com/@ChannelA"
              disabled={loading}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, caretColor: '#FF0040' }}
            />
          </div>
        </div>

        {/* VS divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,0,64,0.08)', border: '1px solid rgba(255,0,64,0.2)',
            borderRadius: 999, padding: '4px 12px',
            color: '#FF6B9D', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
          }}>
            <Swords size={11} />
            VS
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Channel B */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: 8,
            background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#60A5FA',
          }}>B</span>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: '#1A1A27', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '8px 12px',
            transition: 'border-color 200ms',
          }}
            onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.4)'}
            onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <YTIcon />
            <input
              type="text" value={url2} onChange={e => setUrl2(e.target.value)}
              placeholder="https://youtube.com/@ChannelB"
              disabled={loading}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, caretColor: '#60A5FA' }}
            />
          </div>
        </div>

        {/* Compare button */}
        <button
          type="submit"
          disabled={loading || !url1.trim() || !url2.trim()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'linear-gradient(135deg,#FF0040,#FF6B9D)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            padding: '13px 24px', borderRadius: 12, border: 'none',
            cursor: loading || !url1.trim() || !url2.trim() ? 'not-allowed' : 'pointer',
            opacity: !url1.trim() || !url2.trim() ? 0.5 : 1,
            transition: 'opacity 200ms, transform 200ms',
            boxShadow: '0 0 20px rgba(255,0,64,0.2)',
          }}
          onMouseEnter={e => { if (!loading && url1.trim() && url2.trim()) (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
        >
          {loading ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Analyzing both channels...</>
          ) : (
            <><Swords size={15} />Compare Channels<ArrowRight size={15} /></>
          )}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  )
}
