'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Trophy, Newspaper, Calendar, Heart, Leaf, TrendingUp, ArrowRight } from 'lucide-react'

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
          fetch('/api/kegiatan').then((r) => r.json()), // 🌟 Sudah disinkronkan ke /api/kegiatan
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

  // 🌟 DATA KATEGORI PROGRAM KERJA (Rute sudah diselaraskan ke /admin/kegiatan)
  const adminSections = [
    { name: 'Program Sosial', route: '/admin/kegiatan?category=sosial', icon: Heart, color: '#be123c', countDesc: 'Kelola bakti sosial & bantuan' },
    { name: 'Program Olahraga', route: '/admin/kegiatan?category=olahraga', icon: Trophy, color: '#9f1239', countDesc: 'Kelola turnamen & olahraga rutin' },
    { name: 'Program Lingkungan', route: '/admin/kegiatan?category=lingkungan', icon: Leaf, color: '#881337', countDesc: 'Kelola penanaman & kebersihan' },
    { name: 'Program Kewirausahaan', route: '/admin/kegiatan?category=kewirausahaan', icon: TrendingUp, color: '#4c0519', countDesc: 'Kelola UMKM & bazar warga' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      
      {/* SECTION 1: WELCOME HEADER */}
      <div>
        <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Selamat Datang, Admin!</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14 }}>Kelola data kepengurusan dan konten publik Karang Taruna di sini.</p>
      </div>

      {/* SECTION 2: STATS COUNTER GRID */}
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

        {/* Card Total Kegiatan */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 16 }}>
          <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 8 }}>Total Kegiatan</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
            {loading ? '...' : stats.totalKegiatan}
          </div>
        </div>
      </div>

      {/* SECTION 3: MANAJEMEN BIDANG PROGRAM KERJA (PINTASAN CRUD) */}
      <div style={{ padding: '8px 0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>Manajemen Bidang Program Kerja</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {adminSections.map((sec, i) => {
            const Icon = sec.icon
            return (
              <Link key={i} href={sec.route} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(159,18,57,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Icon size={20} color={sec.color} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{sec.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>{sec.countDesc}</p>
                  <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Buka CRUD Panel <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}