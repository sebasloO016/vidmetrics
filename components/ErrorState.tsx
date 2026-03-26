'use client'

import { AlertCircle, RotateCcw } from 'lucide-react'

interface Props {
  message: string
  onReset: () => void
}

export default function ErrorState({ message, onReset }: Props) {
  return (
    <div style={{
      maxWidth: 420, margin: '48px auto', textAlign: 'center',
      background: '#111118', border: '1px solid rgba(239,68,68,0.15)',
      borderRadius: 16, padding: '40px 32px',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <AlertCircle size={24} color="#EF4444" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        Channel not found
      </h3>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        {message}. Try using the full URL like<br />
        <span style={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: 13 }}>
          youtube.com/@channelname
        </span>
      </p>
      <button
        onClick={onReset}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', borderRadius: 10, padding: '10px 20px',
          fontSize: 14, fontWeight: 500, cursor: 'pointer',
          transition: 'background 200ms ease',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'}
      >
        <RotateCcw size={14} />
        Try again
      </button>
    </div>
  )
}
