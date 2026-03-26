'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Props {
  onAnalyze: (url: string) => void
  loading: boolean
  compact?: boolean
}

export default function ChannelInput({ onAnalyze, loading, compact }: Props) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) onAnalyze(url.trim())
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: compact ? '100%' : 620, margin: '0 auto' }}>
      <div style={{
        display: 'flex', gap: 10,
        background: '#1A1A27',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: 6,
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      }}
        onFocusCapture={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,64,0.4)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(255,0,64,0.08)'
        }}
        onBlurCapture={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        {/* YouTube icon */}
        <div style={{
          display: 'flex', alignItems: 'center', paddingLeft: 10, flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#FF0040"/>
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
          </svg>
        </div>

        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/@MrBeast"
          disabled={loading}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontSize: 14, padding: '8px 4px',
            caretColor: '#FF0040',
          }}
        />

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="gradient-bg glow-accent-sm"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'white', fontWeight: 600, fontSize: 14,
            padding: '10px 16px', borderRadius: 10,
            border: 'none', cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            opacity: !url.trim() ? 0.5 : 1,
            transition: 'opacity 200ms ease, transform 200ms ease',
            whiteSpace: 'nowrap', flexShrink: 0,
            minWidth: 0,
          }}
          onMouseEnter={e => {
            if (!loading && url.trim()) (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={15} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              <span className="btn-text">Analyzing...</span>
            </>
          ) : (
            <>
              <span className="btn-text">Analyze</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .btn-text { display: none; }
        }
      `}</style>
    </form>
  )
}
