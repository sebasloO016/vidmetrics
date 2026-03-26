'use client'

export default function SkeletonLoader() {
  return (
    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{
        textAlign: 'center', color: '#4B5563', fontSize: 13, marginBottom: 8,
        letterSpacing: '0.02em',
      }}>
        Analyzing channel performance...
      </p>

      {/* Channel header skeleton */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#1E1E2E' }} className="animate-pulse" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
            <div style={{ height: 20, width: '35%', background: '#1E1E2E', borderRadius: 6 }} className="animate-pulse" />
            <div style={{ height: 14, width: '60%', background: '#1A1A27', borderRadius: 6 }} className="animate-pulse" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[...Array(3)].map((_,i) => (
            <div key={i} style={{ height: 68, background: '#1A1A27', borderRadius: 12 }} className="animate-pulse" />
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ height: 16, width: 160, background: '#1E1E2E', borderRadius: 6, marginBottom: 20 }} className="animate-pulse" />
        <div style={{ height: 200, background: '#1A1A27', borderRadius: 10 }} className="animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ height: 36, flex: 1, background: '#1A1A27', borderRadius: 10 }} className="animate-pulse" />
          <div style={{ height: 36, width: 360, background: '#1A1A27', borderRadius: 10 }} className="animate-pulse" />
        </div>
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '10px 0',
            borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            alignItems: 'center',
          }}>
            <div style={{ width: 20, height: 14, background: '#1E1E2E', borderRadius: 4, flexShrink: 0 }} className="animate-pulse" />
            <div style={{ width: 128, height: 72, background: '#1E1E2E', borderRadius: 8, flexShrink: 0 }} className="animate-pulse" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ height: 14, width: '70%', background: '#1A1A27', borderRadius: 4 }} className="animate-pulse" />
              <div style={{ height: 11, width: '30%', background: '#1A1A27', borderRadius: 4 }} className="animate-pulse" />
            </div>
            {[...Array(4)].map((_,j) => (
              <div key={j} style={{ width: 56, height: 36, background: '#1A1A27', borderRadius: 6 }} className="animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
