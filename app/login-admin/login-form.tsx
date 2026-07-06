'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogIn, AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorType = searchParams?.get('error')
    if (errorType === 'Callback' || errorType === 'AccessDenied') {
      setError('Akses ditolak! Email Google kamu belum terdaftar di database anggota.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signIn('credentials', { redirect: false, email, password })
      if (res?.error) {
        setError('Email atau password salah')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Email</label>
          <input
            type="email"
            placeholder="admin@dalaranger08.id"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: 8, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}
        >
          <LogIn size={16} />
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: 10 }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>atau</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', border: '1px solid #dadce0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.83 2.69-6.57z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.71H.92v2.32C2.4 15.02 5.46 18 9 18z" fill="#34A853"/>
          <path d="M3.95 10.74c-.18-.54-.28-1.12-.28-1.74s.1-1.2.28-1.74V4.94H.92C.33 6.12 0 7.47 0 9s.33 2.88.92 4.06l3.03-2.32z" fill="#FBBC05"/>
          <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.8 11.43 0 9 0 5.46 0 2.4 2.98.92 5.94l3.03 2.32C4.66 5.16 6.65 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Masuk dengan Google
      </button>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)', textAlign: 'center' }}>
        Belum menjadi anggota?{' '}
        <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
          Daftar Dulu
        </Link>
      </div>
    </>
  )
}
