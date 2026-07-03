'use client'
import { useState, useEffect } from 'react'
import { Calendar, MapPin, Search, Filter } from 'lucide-react'

const categories = ['Semua', 'Sosial', 'Olahraga', 'Lingkungan', 'Kewirausahaan']
const categoryColors: Record<string, string> = {
  sosial: '#ec4899', olahraga: '#3b82f6', lingkungan: '#10b981', kewirausahaan: '#f59e0b',
}

export default function KegiatanPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [category, setCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/activities').then(r => r.json()).then(d => {
      setActivities(d)
      setFiltered(d)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let f = activities
    if (category !== 'Semua') f = f.filter(a => a.category.toLowerCase() === category.toLowerCase())
    if (search) f = f.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))
    setFiltered(f)
  }, [category, search, activities])

  return (
    <div>
      <div style={{ padding: '60px 24px 40px', background: 'var(--bg2)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, marginBottom: 12 }}>
            📅 Kegiatan Kami
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 16 }}>
            Dokumentasi berbagai kegiatan positif Karang Taruna Dala Ranger 08
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={16} color="var(--text3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari kegiatan..."
              style={{ paddingLeft: 40 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${category === cat ? 'var(--primary)' : 'var(--border)'}`,
                background: category === cat ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: category === cat ? 'var(--primary)' : 'var(--text2)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320, borderRadius: 12 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text3)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p>Tidak ada kegiatan yang ditemukan.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map((a: any) => {
              const color = categoryColors[a.category] || '#f59e0b'
              return (
                <div key={a.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 180, background: `linear-gradient(135deg, ${color}22, ${color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: 52 }}>
                      {a.category === 'sosial' ? '🤝' : a.category === 'olahraga' ? '⚽' : a.category === 'lingkungan' ? '🌿' : '💼'}
                    </span>
                    <div style={{
                      position: 'absolute', top: 12, left: 12, padding: '4px 10px',
                      background: `${color}25`, border: `1px solid ${color}50`,
                      color, borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
                    }}>{a.category}</div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>{a.title}</h3>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 13 }}>
                        <Calendar size={13} /> {new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 13 }}>
                        <MapPin size={13} /> {a.location}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}