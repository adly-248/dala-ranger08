import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginAdminPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '24px 16px' }}>
      <div style={{ maxWidth: 400, width: '100%', padding: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: 'center', color: 'var(--text)' }}>
          Login Pengurus
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
          Masuk ke panel kepengurusan Karang Taruna Dala Ranger 08
        </p>

        {/* Suspense WAJIB membungkus komponen yang pakai useSearchParams */}
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 14 }}>Memuat form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}