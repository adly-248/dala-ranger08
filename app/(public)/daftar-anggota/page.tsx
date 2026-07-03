'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserPlus, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

export default function DaftarAnggotaPublik() {
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [education, setEducation] = useState('')
  const [reason, setReason] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/daftar-anggota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, birthDate, address, phone, email, education, reason }),
      })

      if (res.ok) {
        setSuccess(true)
        setFullName('')
        setBirthDate('')
        setAddress('')
        setPhone('')
        setEmail('')
        setEducation('')
        setReason('')
      } else {
        const errData = await res.json()
        setError(errData.error || 'Gagal mengirim pendaftaran.')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '32px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, textAlign: 'center' }}>
        <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Pendaftaran Berhasil! 🎉</h2>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
          Data pendaftaran kamu sudah masuk ke sistem pengurus Karang Taruna Dala Ranger 08. Mohon tunggu proses verifikasi oleh Admin.
        </p>
        <button onClick={() => setSuccess(false)} style={{ marginTop: 24, padding: '10px 20px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          Kirim Pendaftaran Lain
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '24px 16px' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text2)', textDecoration: 'none', marginBottom: 24, fontSize: 14 }}>
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', padding: 12, background: 'rgba(245,158,11,0.1)', borderRadius: 12, marginBottom: 12 }}>
          <UserPlus color="var(--primary)" size={28} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Gabung Anggota Karang Taruna</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Isi formulir di bawah ini dengan data asli kamu untuk mengajukan kepengurusan.</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '12px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Nama Lengkap *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Masukkan nama lengkap kamu" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Tanggal Lahir *</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Nomor Telepon/WA *</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="08xxxxxxxxxx" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Email Aktif *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="contoh@gmail.com" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Pendidikan Terakhir *</label>
            <input type="text" value={education} onChange={e => setEducation(e.target.value)} required placeholder="Contoh: SMA, SMK, S1" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Alamat Rumah *</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} required placeholder="Alamat lengkap tempat tinggal sekarang" rows={2} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, resize: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Alasan Ingin Bergabung *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} required placeholder="Tuliskan motivasi kamu bergabung..." rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, resize: 'none' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, marginTop: 8 }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Mengirim Berkas...' : 'Kirim Formulir Pendaftaran'}
          </button>
        </form>
      </div>
    </div>
  )
}