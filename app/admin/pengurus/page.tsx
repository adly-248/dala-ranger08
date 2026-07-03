'use client'

import { useState, useEffect } from 'react'
import { Check, X, Loader2, Calendar, UserCheck, AlertCircle, Phone, Mail, GraduationCap } from 'lucide-react'

interface RegistrationItem {
  id: string
  fullName: string
  birthDate: string
  address: string
  phone: string
  email: string
  education: string
  reason: string
  status: string // pending, accepted, rejected
  createdAt: string
}

export default function AdminVerifikasiWarga() {
  const [requests, setRequests] = useState<RegistrationItem[]>([])
  const [loadingFetch, setLoadingFetch] = useState(true)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchRequests = () => {
    fetch('/api/daftar-anggota')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data')
        return res.json()
      })
      .then((data) => {
        setRequests(Array.isArray(data) ? data : [])
        setLoadingFetch(false)
      })
      .catch((err) => {
        console.error(err)
        setLoadingFetch(false)
      })
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: 'accepted' | 'rejected') => {
    setLoadingAction(id)
    try {
      const res = await fetch('/api/daftar-anggota', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserCheck color="var(--primary)" size={isMobile ? 22 : 28} /> Verifikasi Pendaftaran Warga
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Tinjau dan setujui permohonan warga yang ingin bergabung menjadi anggota kepengurusan aktif.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loadingFetch ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            Memuat berkas pendaftaran...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, textAlign: 'center', color: 'var(--text3)' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            Belum ada pengajuan pendaftaran anggota masuk saat ini.
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border)', 
              borderRadius: 16, 
              padding: 20, 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'stretch' : 'center', 
              gap: 16 
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{req.fullName || 'Nama Tidak Diketahui'}</h3>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: 100,
                    background: req.status === 'accepted' ? 'rgba(16,185,129,0.15)' : req.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: req.status === 'accepted' ? '#10b981' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                    textTransform: 'uppercase'
                  }}>{req.status}</span>
                </div>

                {/* Tampilan Detail Informasi Baru Warga */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, fontSize: 13, color: 'var(--text2)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} style={{ opacity: 0.7 }} /> {req.phone}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} style={{ opacity: 0.7 }} /> {req.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><GraduationCap size={14} style={{ opacity: 0.7 }} /> Pendidikan: {req.education}</span>
                  <span><strong>Alamat:</strong> {req.address}</span>
                  <div style={{ marginTop: 6, padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12.5 }}>
                    <strong>Alasan Bergabung:</strong> <span style={{ color: 'var(--text3)' }}>"{req.reason}"</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 12, marginTop: 6 }}>
                    <Calendar size={12} /> Diajukan pada: {new Date(req.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Tombol Aksi validasi (menyesuaikan value lowercase 'pending') */}
              {req.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8, justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                  <button
                    disabled={loadingAction === req.id}
                    onClick={() => handleUpdateStatus(req.id, 'rejected')}
                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <X size={14} /> Tolak
                  </button>
                  <button
                    disabled={loadingAction === req.id}
                    onClick={() => handleUpdateStatus(req.id, 'accepted')}
                    style={{ background: 'var(--primary)', border: 'none', color: '#000', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {loadingAction === req.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
                    Setujui
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}