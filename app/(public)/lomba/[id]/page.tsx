'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Trophy, ArrowLeft, CheckCircle, X, Loader2 } from 'lucide-react'

export default function LombaDetailPage() {
  const params = useParams()
  const [competition, setCompetition] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Form disesuaikan untuk pendaftaran perorangan/warga (Butuh Umur!)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    age: '',
  })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Mengambil data kompetisi dari endpoint bawaan kamu
    Promise.all([
      fetch(`/api/competitions/${params.id}`).then(r => r.json()),
      fetch(`/api/competitions/${params.id}/registrations`).then(r => r.json()),
    ]).then(([comp, regs]) => {
      setCompetition(comp)
      setRegistrations(regs)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  // 🌟 PERBAIKAN UTAMA: Mengarahkan fetch ke API otomatisasi umur kita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.age) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/lomba/daftar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lombaId: params.id, 
          name: form.name,
          phone: form.phone,
          age: form.age,
          email: form.email,
          address: form.address
        }),
      })

      if (res.ok) { 
        setSuccess(true)
        setShowForm(false)
        // Reset form
        setForm({ name: '', phone: '', email: '', address: '', age: '' })
        
        // Refresh daftar peserta terdaftar di bawah
        fetch(`/api/competitions/${params.id}/registrations`)
          .then(r => r.json())
          .then(regs => setRegistrations(regs))
      } else {
        alert('Gagal mendaftar, periksa kembali inputan Anda.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: 'var(--text3)' }}>Memuat...</div>
  if (!competition || competition.error) return <div style={{ padding: 80, textAlign: 'center', color: 'var(--text3)' }}>Lomba tidak ditemukan.</div>

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' }}>
      <Link href="/lomba" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text2)', textDecoration: 'none', marginBottom: 32, fontSize: 14 }}>
        <ArrowLeft size={16} /> Kembali ke Daftar Lomba
      </Link>

      {success && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={20} color="#10b981" />
          <div>
            <div style={{ fontWeight: 700, color: '#10b981' }}>Pendaftaran Berhasil!</div>
            <div style={{ fontSize: 14, color: 'var(--text2)' }}>Sistem berhasil menentukan kategori kompetisi berdasarkan umur Anda secara otomatis!</div>
          </div>
        </div>
      )}

      {/* Grid Layout Detail Lomba */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: 32, alignItems: 'start' }}>
        {/* Main Section */}
        <div>
          <div style={{ height: isMobile ? 180 : 280, borderRadius: 16, background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <Trophy size={isMobile ? 50 : 80} color="var(--primary)" style={{ opacity: 0.6 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
            <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 900, lineHeight: 1.3 }}>{competition.name}</h1>
            <span className={`badge-status badge-${competition.status}`} style={{ fontSize: 13 }}>
              {competition.status === 'open' ? '🟢 Pendaftaran Dibuka' : '🔴 Ditutup'}
            </span>
          </div>

          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 32 }}>{competition.description}</p>

          {/* List Peserta Terdaftar */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>👥 Warga Terdaftar ({registrations.length})</h2>
            {registrations.length === 0 ? (
              <p style={{ color: 'var(--text3)', fontSize: 14 }}>Belum ada warga yang mendaftar. Jadi yang pertama!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {registrations.map((r: any, i: number) => {
                  // Mengurai string data member untuk mencari tahu kategori umur otomatisnya
                  let parsedMember: any = {}
                  try { parsedMember = JSON.parse(r.members)[0] || {} } catch(e){}
                  
                  return (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '14px 20px', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{r.leaderName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Asal: {r.leaderAddress || 'Bandung'}</div>
                      </div>
                      <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'var(--surface2)', color: 'var(--primary)', fontWeight: 700 }}>
                        {parsedMember.category || 'Umum'} ({parsedMember.age || r.memberCount} Thn)
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Ringkas */}
        <div style={{ position: isMobile ? 'static' : 'sticky', top: 88 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '14px 0', background: 'var(--surface2)', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>TANGGAL</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{new Date(competition.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '14px 0', background: 'var(--surface2)', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>BIAYA</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#10b981' }}>GRATIS</div>
              </div>
            </div>

            {competition.status === 'open' ? (
              <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '14px 0', borderRadius: 8, background: 'var(--primary)', border: 'none', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                🚀 DAFTAR SEKARANG
              </button>
            ) : (
              <button disabled style={{ width: '100%', padding: '14px 0', borderRadius: 8, background: 'var(--surface2)', color: 'var(--text3)', cursor: 'not-allowed', fontWeight: 600 }}>
                Pendaftaran Ditutup
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PENDAFTARAN BARU (INDIVIDU + UMUR) */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '24px 16px' : '32px', maxWidth: 480, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>📝 Formulir Pendaftaran</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text2)' }}>Nama Lengkap Anda *</label>
                <input required type="text" placeholder="Masukkan nama lengkap" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text2)' }}>Umur (Tahun) *</label>
                  <input required type="number" min={1} max={100} placeholder="Contoh: 16" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text2)' }}>No. WhatsApp *</label>
                  <input required type="text" placeholder="08xxxxxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text2)' }}>Email</label>
                <input type="email" placeholder="nama@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text2)' }}>Alamat Rumah</label>
                <input type="text" placeholder="Nama jalan / nomor RT RW" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'var(--surface2)', border: 'none', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                <button type="submit" disabled={submitting || !form.name || !form.age} style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'var(--primary)', border: 'none', color: '#000', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  {submitting ? 'Memproses...' : 'Kirim Form'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}