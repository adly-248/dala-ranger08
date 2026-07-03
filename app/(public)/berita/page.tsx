'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Newspaper, ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react'

const ITEMS_PER_PAGE = 6

export default function BeritaPage() {
  const [news, setNews] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(d => { setNews(d); setFiltered(d); setLoading(false) })
  }, [])

  useEffect(() => {
    const f = search ? news.filter(n => n.title.toLowerCase().includes(search.toLowerCase())) : news
    setFiltered(f)
    setPage(1)
  }, [search, news])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div>
      <div style={{ padding: '60px 24px 40px', background: 'var(--bg2)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, marginBottom: 12 }}>
            📰 Berita & Artikel
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 16 }}>
            Kabar terkini dari Karang Taruna Dala Ranger 08
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ position: 'relative', marginBottom: 32, maxWidth: 480 }}>
          <Search size={16} color="var(--text3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari berita..." style={{ paddingLeft: 40 }} />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 12 }} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text3)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p>Tidak ada berita ditemukan.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
              {paginated.map((n: any) => (
                <Link key={n.id} href={`/berita/${n.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
                    <div style={{ height: 160, background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Newspaper size={40} color="#3b82f6" style={{ opacity: 0.6 }} />
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 12 }}>
                          <Calendar size={12} /> {new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 12 }}>
                          <User size={12} /> {n.author}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: 'var(--text)' }}>{n.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${p === page ? 'var(--primary)' : 'var(--border)'}`, background: p === page ? 'rgba(245,158,11,0.15)' : 'var(--surface)', color: p === page ? 'var(--primary)' : 'var(--text)', cursor: 'pointer', fontWeight: p === page ? 700 : 400 }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}