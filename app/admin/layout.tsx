'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Trophy, Newspaper, LogOut, ShieldAlert, Globe, Calendar, Image, UserCheck } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() // 👈 Mendeteksi rute aktif untuk efek seperti image_b2550a.png
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login-admin')
  }

  // Fungsi pembantu untuk membuat style menu aktif/tidak aktif secara dinamis
  const getMenuStyle = (menuPath: string) => {
    const isActive = pathname === menuPath
    return {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 6 : 12,
      padding: isMobile ? '8px 12px' : '12px',
      borderRadius: 8,
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: isMobile ? 13 : 14,
      fontWeight: 600,
      // 🌟 JIKA AKTIF: Beri warna emas & background gelap tipis sesuai image_b2550a.png
      color: isActive ? 'var(--primary)' : 'var(--text2)',
      background: isActive ? 'var(--surface2)' : 'transparent',
      transition: 'all 0.2s ease',
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row', background: 'var(--bg2)' }}>
      {/* Sidebar Admin Tetap Diam Di Sini */}
      <div style={{
        width: isMobile ? '100%' : 260,
        background: 'var(--surface)',
        borderRight: isMobile ? 'none' : '1px solid var(--border)',
        borderBottom: isMobile ? '1px solid var(--border)' : 'none',
        padding: isMobile ? '20px 16px' : '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 20 : 32
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={20} color="var(--primary)" /> Admin Panel
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Dala Ranger 08</div>
          </div>
          {isMobile && (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <LogOut size={20} />
            </button>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: 8, flex: isMobile ? 'initial' : 1 }}>
          <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 12, padding: isMobile ? '8px 12px' : '12px', borderRadius: 8, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', fontWeight: 600, textDecoration: 'none', fontSize: isMobile ? 13 : 14 }}>
            <Globe size={16} /> Website Utama ↗
          </Link>

          {!isMobile && <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />}

          {/* Menu-menu otomatis berubah warna jika di-klik */}
          <Link href="/admin" style={getMenuStyle('/admin')}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link href="/admin/anggota" style={getMenuStyle('/admin/anggota')}>
            <Users size={16} /> Anggota
          </Link>
          <Link href="/admin/pengurus" style={getMenuStyle('/admin/pengurus')}>
            <UserCheck size={16} /> Verifikasi Warga
          </Link>
          <Link href="/admin/lomba" style={getMenuStyle('/admin/lomba')}>
            <Trophy size={16} /> Lomba
          </Link>
          {/* 👇 SISIPKAN INI */}
          <Link href="/admin/kegiatan" style={getMenuStyle('/admin/kegiatan')}>
            <Calendar size={16} /> Kegiatan
          </Link>
          <Link href="/admin/galeri" style={getMenuStyle('/admin/galeri')}>
            <Image size={16} /> Galeri
          </Link>
          <Link href="/admin/berita" style={getMenuStyle('/admin/berita')}>
            <Newspaper size={16} /> Berita
          </Link>
        </nav>

        {!isMobile && (
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', width: '100%', background: 'none', border: 'none', borderRadius: 8, color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={18} /> Keluar Sistem
          </button>
        )}
      </div>

      {/* Tempat Konten Halaman yang Berubah Secara Dinamis */}
      <div style={{ flex: 1, padding: isMobile ? '24px 16px' : '40px' }}>
        {children}
      </div>
    </div>
  )
}