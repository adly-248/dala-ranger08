'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ChevronDown, LogOut, Shield } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/berita', label: 'Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/lomba', label: 'Lomba' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false) // 🌟 State untuk deteksi ukuran layar HP
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    // Jalankan deteksi layar pertama kali & saat resize jendela browser
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    
    handleResize() // Jalankan langsung saat komponen dimuat
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled || open ? 'rgba(255,255,255,0.98)' : 'transparent',
      backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
      borderBottom: scrolled || open ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} onClick={() => setOpen(false)}>
          <div style={{
            width: 38, height: 38, position: 'relative',
            borderRadius: 8, overflow: 'hidden', flexShrink: 0,
          }}>
            <Image
              src="/dalarangers.png"
              alt="Logo Karang Taruna Dala Rangers"
              fill
              sizes="38px"
              className="object-contain"
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', lineHeight: 1.2 }}>Dala Ranger 08</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', lineHeight: 1 }}>Karang Taruna</div>
          </div>
        </Link>

        {/* Desktop Nav Links (Hanya muncul jika BUKAN di layar HP) */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: pathname === link.href ? 'var(--primary)' : 'var(--text2)',
                textDecoration: 'none',
                background: pathname === link.href ? 'rgba(159,18,57,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}>{link.label}</Link>
            ))}
          </div>
        )}

        {/* Desktop CTA & User Menu (Hanya muncul jika BUKAN di layar HP) */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {session ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenu(!userMenu)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, cursor: 'pointer', color: 'var(--text)', fontSize: 14,
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#ffffff',
                  }}>
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {session.user?.name?.split(' ')[0]}
                  <ChevronDown size={14} />
                </button>
                {userMenu && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 8,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: 6, minWidth: 180,
                    boxShadow: '0 8px 30px rgba(159,18,57,0.12)',
                  }}>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 6, color: 'var(--primary)', textDecoration: 'none', fontSize: 14 }}>
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                    <button onClick={() => signOut()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 6, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: 14 }}>
                      <LogOut size={15} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login-admin" className="btn-outline" style={{ fontSize: 14, padding: '9px 18px' }}>Masuk</Link>
                <Link href="/daftar-anggota" className="btn-primary" style={{ fontSize: 14, padding: '9px 18px' }}>Daftar Anggota</Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Button (Hanya muncul di layar HP / Lebar < 768px) */}
        {isMobile && (
          <button onClick={() => setOpen(!open)} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown Panel (Akan terbuka kebawah saat burger diklik) */}
      {isMobile && open && (
        <div style={{
          background: '#ffffff', borderTop: '1px solid var(--border)',
          padding: '8px 24px 24px', position: 'absolute', top: 68, left: 0, right: 0,
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 4
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '14px 0', color: pathname === link.href ? 'var(--primary)' : 'var(--text2)',
              textDecoration: 'none', fontSize: 15, fontWeight: 500,
              borderBottom: '1px solid rgba(0,0,0,0.04)',
            }}>{link.label}</Link>
          ))}
          <div style={{ marginTop: 20, display: 'flex', gap: 12, flexDirection: 'column' }}>
            {session ? (
              <>
                <Link href="/dashboard" className="btn-outline" style={{ textAlign: 'center', padding: '12px' }} onClick={() => setOpen(false)}>Dashboard</Link>
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link href="/admin" className="btn-outline" style={{ textAlign: 'center', padding: '12px', color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={() => setOpen(false)}>Admin Panel</Link>
                )}
                <button onClick={() => { signOut(); setOpen(false); }} className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>Keluar</button>
              </>
            ) : (
              <>
                <Link href="/login-admin" className="btn-outline" style={{ textAlign: 'center', padding: '12px' }} onClick={() => setOpen(false)}>Masuk</Link>
                <Link href="/daftar-anggota" className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }} onClick={() => setOpen(false)}>Daftar Anggota</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}