'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal mendaftarkan akun')
      } else {
        alert('Pendaftaran Berhasil! Silahkan login menggunakan akun baru kamu.')
        router.push('/login-admin') // Alihkan ke halaman login kamu
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '24px 16px' }}>
      <div style={{ maxWidth: 400, width: '100%', padding: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: 'center', color: 'var(--text)' }}>Buat Akun Baru</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>Daftarkan akun web kamu untuk mengakses fitur publik Karang Taruna</p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Nama Lengkap</label>
            <input type="text" placeholder="Cristiano Ronaldo" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Email</label>
            <input type="email" placeholder="kamu@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Password</label>
            <input type="password" placeholder="Minimal 6 karakter" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '12px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={16} />}
            {loading ? 'Mendaftar...' : 'Daftar Akun'}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', textAlign: 'center' }}>
          Sudah punya akun?{' '}
          <Link href="/login-admin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Login di Sini
          </Link>
        </div>
      </div>
    </div>
  )
}