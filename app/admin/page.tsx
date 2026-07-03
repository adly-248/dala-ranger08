'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboardPage() {
  const [isMobile, setIsMobile] = useState(false)
  
  // State menampung statistik riil database
  const [stats, setStats] = useState({
    totalAnggota: 0,
    lombaAktif: 0,
    totalBerita: 0,
    totalKegiatan: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // AMBIL DATA REAL-TIME DARI API BACKEND
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        
        const [resMembers, resLomba, resBerita, resActivities] = await Promise.all([
          fetch('/api/members').then((r) => r.json()),
          fetch('/api/lomba').then((r) => r.json()),
          fetch('/api/news').then((r) => r.json()),
          fetch('/api/activities').then((r) => r.json()), 
        ])

        setStats({
          totalAnggota: Array.isArray(resMembers) ? resMembers.length : 0,
          lombaAktif: Array.isArray(resLomba) ? resLomba.length : 0,
          totalBerita: Array.isArray(resBerita) ? resBerita.length : 0,
          totalKegiatan: Array.isArray(resActivities) ? resActivities.length : 0,
        })
      } catch (err) {
        console.error('Gagal memuat statistik dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Selamat Datang, Admin!</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14 }}>Kelola data kepengurusan dan konten publik Karang Taruna di sini.</p>
      </div>

      {/* Info Cards Grid Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', 
        gap: isMobile ? 16 : 24 
      }}>
        {/* Card Total Anggota */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 16 }}>
          <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 8 }}>Total Anggota</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
            {loading ? '...' : stats.totalAnggota}
          </div>
        </div>

        {/* Card Lomba Aktif */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 16 }}>
          <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 8 }}>Lomba Aktif</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
            {loading ? '...' : stats.lombaAktif}
          </div>
        </div>

        {/* Card Total Berita */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 16 }}>
          <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 8 }}>Total Berita</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
            {loading ? '...' : stats.totalBerita}
          </div>
        </div>

        {/* 🌟 Card Total Kegiatan (Baru Ditambahkan) */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 16 }}>
          <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 8 }}>Total Kegiatan</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
            {loading ? '...' : stats.totalKegiatan}
          </div>
        </div>
      </div>
    </div>
  )
}