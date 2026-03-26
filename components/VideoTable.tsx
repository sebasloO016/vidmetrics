'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Play, TrendingUp, Film, Zap, X, Calendar, SlidersHorizontal } from 'lucide-react'

interface Video {
  id: string; title: string; thumbnail: string; publishedAt: string
  views: number; likes: number; comments: number; duration: string
}
interface Props { videos: Video[] }

function durationSeconds(iso: string): number {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] || '0') * 3600) + (parseInt(m[2] || '0') * 60) + parseInt(m[3] || '0')
}
function isShort(v: Video) { return durationSeconds(v.duration) <= 60 }
function fmt(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtDur(iso: string) {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return '-'
  const h = m[1] ? m[1] + ':' : ''
  return `${h}${m[2]?.padStart(h ? 2 : 1, '0') || '0'}:${m[3]?.padStart(2, '0') || '00'}`
}
function engRate(v: Video) {
  if (!v.views) return 0
  return ((v.likes + v.comments) / v.views) * 100
}
function engColor(v: Video) {
  const r = engRate(v)
  if (r >= 3) return '#34D399'
  if (r >= 1) return '#FBBF24'
  return '#4B5563'
}

type SortKey = 'views' | 'likes' | 'comments' | 'publishedAt' | 'engagement'
type ContentFilter = 'all' | 'videos' | 'shorts'
type DateRange = '7' | '30' | '90' | 'all'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'views', label: 'Most viewed' },
  { key: 'likes', label: 'Most liked' },
  { key: 'comments', label: 'Most commented' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'publishedAt', label: 'Latest' },
]
const DATE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: '7', label: '7d' },
  { key: '30', label: '30d' },
  { key: '90', label: '90d' },
  { key: 'all', label: 'All' },
]

function VideoPreview({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.18 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, overflow: 'hidden',
          width: '100%', maxWidth: 760,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
        <div style={{
          padding: '14px 18px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={{
              color: '#fff', fontWeight: 600, fontSize: 14, lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8,
            }}>
              {video.title}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ color: '#60A5FA', fontSize: 12, fontWeight: 600 }}>{fmt(video.views)} views</span>
              <span style={{ color: '#F472B6', fontSize: 12, fontWeight: 600 }}>{fmt(video.likes)} likes</span>
              <span style={{ color: '#FBBF24', fontSize: 12, fontWeight: 600 }}>{fmt(video.comments)} comments</span>
              <span style={{ color: engColor(video), fontSize: 12, fontWeight: 600 }}>{engRate(video).toFixed(2)}% engagement</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0, width: 30, height: 30, borderRadius: 8,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#9CA3AF', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#9CA3AF' }}
          >
            <X size={13} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function VideoTable({ videos }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>('views')
  const [search, setSearch] = useState('')
  const [contentType, setContentType] = useState<ContentFilter>('all')
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(0)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const PAGE_SIZE = 25

  const shortsCount = videos.filter(isShort).length
  const videosCount = videos.filter(v => !isShort(v)).length
  const avgViews = videos.reduce((s, v) => s + v.views, 0) / videos.length
  const maxViews = Math.max(...videos.map(v => v.views))

  const cutoff = dateRange === 'all' ? null : (() => {
    const d = new Date(); d.setDate(d.getDate() - parseInt(dateRange)); return d
  })()

  const filtered = videos
    .filter(v => contentType === 'shorts' ? isShort(v) : contentType === 'videos' ? !isShort(v) : true)
    .filter(v => cutoff ? new Date(v.publishedAt) >= cutoff : true)
    .filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'publishedAt') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      if (sortBy === 'engagement') return engRate(b) - engRate(a)
      return b[sortBy] - a[sortBy]
    })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Reset to page 0 whenever filters change
  const setSort = (v: SortKey) => { setSortBy(v); setPage(0) }
  const setContent = (v: ContentFilter) => { setContentType(v); setPage(0) }
  const setDate = (v: DateRange) => { setDateRange(v); setPage(0) }
  const setSearchVal = (v: string) => { setSearch(v); setPage(0) }

  const onThumbEnter = (v: Video) => { hoverTimer.current = setTimeout(() => setPreviewVideo(v), 700) }
  const onThumbLeave = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }

  return (
    <>
      <AnimatePresence>
        {previewVideo && <VideoPreview video={previewVideo} onClose={() => setPreviewVideo(null)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="card"
        style={{ padding: 20 }}
      >
        {/* Filters row — desktop: inline, mobile: collapsible */}
        <div style={{ marginBottom: 12 }}>
          {/* Mobile filter toggle bar */}
          <div className="mobile-filter-toggle" style={{ display: 'none', alignItems: 'center', gap: 8, marginBottom: filtersOpen ? 10 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, background: '#16161F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '7px 12px' }}>
              <Search size={13} color="#4B5563" />
              <input type="text" placeholder="Search videos..." value={search} onChange={e => setSearchVal(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%', caretColor: '#FF0040' }} />
            </div>
            <button onClick={() => setFiltersOpen(o => !o)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: filtersOpen ? 'rgba(255,0,64,0.12)' : '#16161F',
              border: `1px solid ${filtersOpen ? 'rgba(255,0,64,0.3)' : 'rgba(255,255,255,0.06)'}`,
              color: filtersOpen ? '#FF6B9D' : '#9CA3AF',
              borderRadius: 10, padding: '7px 12px', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, flexShrink: 0,
              transition: 'all 150ms ease',
            }}>
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>

          {/* Filter panels — always visible on desktop, collapsible on mobile */}
          <div className={`filter-panels${filtersOpen ? ' open' : ''}`} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Content type */}
            <div className="filter-group" style={{ display: 'flex', gap: 2, background: '#16161F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 3 }}>
              {([
                { key: 'all' as ContentFilter, label: 'All', count: videos.length, icon: null },
                { key: 'videos' as ContentFilter, label: 'Videos', count: videosCount, icon: Film },
                { key: 'shorts' as ContentFilter, label: 'Shorts', count: shortsCount, icon: Zap },
              ]).map(opt => {
                const Icon = opt.icon; const active = contentType === opt.key
                return (
                  <button key={opt.key} onClick={() => setContent(opt.key)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 11px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 150ms ease', flex: 1,
                    background: active ? (opt.key === 'shorts' ? 'linear-gradient(135deg,rgba(255,0,64,0.2),rgba(255,107,157,0.2))' : 'rgba(255,255,255,0.1)') : 'transparent',
                    color: active ? (opt.key === 'shorts' ? '#FF6B9D' : '#fff') : '#6B7280',
                    border: active && opt.key === 'shorts' ? '1px solid rgba(255,0,64,0.25)' : '1px solid transparent',
                    justifyContent: 'center',
                  }}>
                    {Icon && <Icon size={11} />}
                    {opt.label}
                    <span style={{ fontSize: 10, fontWeight: 600, background: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)', color: active ? '#fff' : '#4B5563', padding: '1px 5px', borderRadius: 999 }}>
                      {opt.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Date range */}
            <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#16161F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 3 }}>
              <Calendar size={11} color="#4B5563" style={{ marginLeft: 8, marginRight: 2, flexShrink: 0 }} />
              {DATE_OPTIONS.map(opt => {
                const active = dateRange === opt.key
                return (
                  <button key={opt.key} onClick={() => setDate(opt.key)} style={{
                    padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    cursor: 'pointer', border: 'none', transition: 'all 150ms ease', flex: 1,
                    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: active ? '#fff' : '#6B7280',
                  }}>{opt.label}</button>
                )
              })}
            </div>

            {/* Sort — label + wrapping buttons on mobile */}
            <div className="filter-group sort-group" style={{ display: 'flex', gap: 2, background: '#16161F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 3, flexWrap: 'wrap' }}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setSort(opt.key)} style={{
                  padding: '6px 11px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', border: 'none', transition: 'all 150ms ease',
                  background: sortBy === opt.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: sortBy === opt.key ? '#fff' : '#6B7280',
                  whiteSpace: 'nowrap',
                }}
                  onMouseEnter={e => { if (sortBy !== opt.key) (e.currentTarget as HTMLElement).style.color = '#D1D5DB' }}
                  onMouseLeave={e => { if (sortBy !== opt.key) (e.currentTarget as HTMLElement).style.color = '#6B7280' }}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop search — hidden on mobile (uses the one in toggle bar) */}
        <div className="desktop-search" style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#16161F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '7px 12px', flex: 1 }}>
            <Search size={13} color="#4B5563" />
            <input type="text" placeholder="Search videos..." value={search} onChange={e => setSearchVal(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%', caretColor: '#FF0040' }} />
          </div>
        </div>

        {/* Result count */}
        {filtered.length !== videos.length && (
          <p style={{ color: '#374151', fontSize: 12, marginBottom: 10 }}>
            Showing {filtered.length} of {videos.length} videos
          </p>
        )}

        {/* Column headers */}
        <div className="col-headers" style={{
          display: 'grid', gridTemplateColumns: '28px 128px 1fr 88px 72px 72px 80px',
          gap: 12, padding: '0 12px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          fontSize: 11, fontWeight: 600, color: '#374151',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>#</span><span></span><span>Title</span>
          <span style={{ textAlign: 'right' }}>Views</span>
          <span style={{ textAlign: 'right' }}>Likes</span>
          <span style={{ textAlign: 'right' }}>Comments</span>
          <span style={{ textAlign: 'right' }}>Engagement</span>
        </div>

        {/* Rows */}
        <div style={{ marginTop: 4 }}>
          {paginated.map((video, i) => {
            const isTrending = video.views > avgViews * 1.5
            const isTop = video.views === maxViews
            return (
              <motion.div key={video.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: i * 0.03 }}
                className="video-row"
                style={{
                  display: 'grid', gridTemplateColumns: '28px 128px 1fr 88px 72px 72px 80px',
                  gap: 12, alignItems: 'center', padding: '10px 12px', borderRadius: 10,
                  transition: 'background 150ms ease',
                  borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#16161F'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <span className="video-rank" style={{ color: '#374151', fontSize: 12, textAlign: 'center' }}>{page * PAGE_SIZE + i + 1}</span>

                {/* Thumbnail with preview */}
                <div style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
                  onMouseEnter={() => onThumbEnter(video)}
                  onMouseLeave={onThumbLeave}
                  onClick={() => setPreviewVideo(video)}
                >
                  <img src={video.thumbnail} alt={video.title}
                    style={{ width: 128, height: 72, objectFit: 'cover', borderRadius: 8, display: 'block', transition: 'transform 200ms ease' }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                  />
                  <div className="thumb-overlay" style={{
                    position: 'absolute', inset: 0, borderRadius: 8,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 200ms ease',
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={13} fill="#000" color="#000" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                  <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'monospace', padding: '2px 5px', borderRadius: 4 }}>
                    {fmtDur(video.duration)}
                  </span>
                  {isTop && <span style={{ position: 'absolute', top: 4, left: 4, background: 'linear-gradient(135deg,#FF0040,#FF6B9D)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>#1</span>}
                  {isShort(video) && !isTop && (
                    <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,0,64,0.85)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Zap size={9} fill="white" />SHORT
                    </span>
                  )}
                </div>

                {/* Title */}
                <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                    {isTrending && (
                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 3, background: 'linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.2))', color: '#FB923C', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999, border: '1px solid rgba(249,115,22,0.25)', marginTop: 1 }}>
                        <TrendingUp size={9} />HOT
                      </span>
                    )}
                    <p className="video-title" style={{ color: '#E5E7EB', fontSize: 13, fontWeight: 500, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 150ms ease' }}>
                      {video.title}
                    </p>
                  </div>
                  <p style={{ color: '#374151', fontSize: 11 }}>{fmtDate(video.publishedAt)}</p>
                </a>

                <div style={{ textAlign: 'right' }} className="video-metrics-desktop"><p style={{ color: '#60A5FA', fontSize: 13, fontWeight: 600 }}>{fmt(video.views)}</p><p style={{ color: '#374151', fontSize: 10, marginTop: 2 }}>views</p></div>
                <div style={{ textAlign: 'right' }} className="video-metrics-desktop"><p style={{ color: '#F472B6', fontSize: 13, fontWeight: 600 }}>{fmt(video.likes)}</p><p style={{ color: '#374151', fontSize: 10, marginTop: 2 }}>likes</p></div>
                <div style={{ textAlign: 'right' }} className="video-metrics-desktop"><p style={{ color: '#FBBF24', fontSize: 13, fontWeight: 600 }}>{fmt(video.comments)}</p><p style={{ color: '#374151', fontSize: 10, marginTop: 2 }}>comments</p></div>
                <div style={{ textAlign: 'right' }} className="video-metrics-desktop"><p style={{ color: engColor(video), fontSize: 13, fontWeight: 600 }}>{engRate(video).toFixed(2)}%</p><p style={{ color: '#374151', fontSize: 10, marginTop: 2 }}>engagement</p></div>

                {/* Mobile metrics row */}
                <div className="video-metrics-mobile" style={{ gridColumn: '1 / -1' }}>
                  {[
                    { label: 'Views', value: fmt(video.views), color: '#60A5FA' },
                    { label: 'Likes', value: fmt(video.likes), color: '#F472B6' },
                    { label: 'Comments', value: fmt(video.comments), color: '#FBBF24' },
                    { label: 'Engagement', value: `${engRate(video).toFixed(1)}%`, color: engColor(video) },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center' }}>
                      <p style={{ color: m.color, fontSize: 13, fontWeight: 700 }}>{m.value}</p>
                      <p style={{ color: '#4B5563', fontSize: 10, marginTop: 2 }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#374151' }}>
              <Search size={26} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No videos match your filters</p>
              <p style={{ fontSize: 12, marginTop: 6, color: '#2D2D3A' }}>Try changing the date range or content type</p>
            </div>
          )}
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 16, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: page === 0 ? 'transparent' : '#16161F',
                border: '1px solid rgba(255,255,255,0.06)',
                color: page === 0 ? '#2D2D3A' : '#9CA3AF',
                borderRadius: 10, padding: '8px 16px',
                fontSize: 13, fontWeight: 500,
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { if (page > 0) (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={e => { if (page > 0) (e.currentTarget as HTMLElement).style.color = '#9CA3AF' }}
            >
              ← Prev
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: page === i ? 'linear-gradient(135deg,#FF0040,#FF6B9D)' : '#16161F',
                    color: page === i ? '#fff' : '#6B7280',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={e => { if (page !== i) (e.currentTarget as HTMLElement).style.color = '#fff' }}
                  onMouseLeave={e => { if (page !== i) (e.currentTarget as HTMLElement).style.color = '#6B7280' }}
                >
                  {i + 1}
                </button>
              ))}
              <span style={{ color: '#374151', fontSize: 12, marginLeft: 4 }}>
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: page === totalPages - 1 ? 'transparent' : '#16161F',
                border: '1px solid rgba(255,255,255,0.06)',
                color: page === totalPages - 1 ? '#2D2D3A' : '#9CA3AF',
                borderRadius: 10, padding: '8px 16px',
                fontSize: 13, fontWeight: 500,
                cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { if (page < totalPages - 1) (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={e => { if (page < totalPages - 1) (e.currentTarget as HTMLElement).style.color = '#9CA3AF' }}
            >
              Next →
            </button>
          </div>
        )}

        <style>{`
          div:hover .thumb-overlay { opacity: 1 !important; }
          a:hover .video-title { color: #FF6B9D !important; }

          @media (max-width: 768px) {
            .mobile-filter-toggle { display: flex !important; }
            .filter-panels { display: none !important; flex-direction: column !important; gap: 8px !important; margin-top: 8px; }
            .filter-panels.open { display: flex !important; }
            .desktop-search { display: none !important; }

            /* Each filter group takes full width on mobile */
            .filter-group { width: 100% !important; box-sizing: border-box !important; }
            .sort-group { flex-wrap: wrap !important; }
            .sort-group button { flex: 1 1 auto !important; text-align: center !important; justify-content: center !important; min-width: 0 !important; }

            .video-row {
              display: flex !important;
              flex-direction: column !important;
              gap: 10px !important;
              padding: 14px 10px !important;
            }
            .video-metrics-mobile {
              display: grid !important;
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 8px !important;
              background: #16161F !important;
              border-radius: 10px !important;
              padding: 10px !important;
            }
            .video-metrics-desktop { display: none !important; }
            .col-headers { display: none !important; }
            .video-rank { display: none !important; }
          }
          @media (min-width: 769px) {
            .video-metrics-mobile { display: none !important; }
            .mobile-filter-toggle { display: none !important; }
          }
        `}</style>
      </motion.div>
    </>
  )
}
