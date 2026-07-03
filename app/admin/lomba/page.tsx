'use client'

import { useState, useEffect } from 'react'
import { Plus, Trophy, Loader2, UserCheck, Pencil, Trash2, ChevronDown, ChevronUp, Shield, User } from 'lucide-react'

interface Lomba {
  id: string
  name: string // Sesuai schema Prisma kamu
  description: string
  _count: { registrations: number }
}

export default function AdminLomba() {
  const [lombaList, setLombaList] = useState<Lomba[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loadingFetch, setLoadingFetch] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // State untuk Edit Lomba
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  // State untuk melihat rincian peserta per lomba
  const [expandedLombaId, setExpandedLombaId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 1. READ: Ambil Semua Lomba
  const fetchLomba = () => {
    fetch('/api/lomba')
      .then((res) => res.json())
      .then((data) => {
        setLombaList(data)
        setLoadingFetch(false)
      })
      .catch(() => setLoadingFetch(false))
  }

  useEffect(() => {
    fetchLomba()
  }, [])

  // 2. READ: Ambil Peserta khusus Lomba tertentu saat di-klik detailnya
  const handleToggleParticipants = async (lombaId: string) => {
    if (expandedLombaId === lombaId) {
      setExpandedLombaId(null)
      return
    }

    setExpandedLombaId(lombaId)
    setLoadingParticipants(true)
    setParticipants([])

    try {
      const res = await fetch(`/api/competitions/${lombaId}/registrations`)
      if (res.ok) {
        const data = await res.json()
        setParticipants(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingParticipants(false)
    }
  }

  // 3. CREATE / UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId ? !editTitle : !title) return
    setLoadingSubmit(true)

    // Jika Mode EDIT
    if (editingId) {
      try {
        const res = await fetch(`/api/competitions/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editTitle, description: editDescription }),
        })
        if (res.ok) {
          cancelEdit()
          fetchLomba() // Refresh data list
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingSubmit(false)
      }
      return
    }

    // Jika Mode TAMBAH BARU
    try {
      const res = await fetch('/api/lomba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (res.ok) {
        setTitle('')
        setDescription('')
        fetchLomba()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSubmit(false)
    }
  }

  // 4. DELETE LOMBA
  const handleDeleteLomba = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus kompetisi ini secara permanen dari database?')) return
    try {
      const res = await fetch(`/api/competitions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLombaList(lombaList.filter((l) => l.id !== id))
        if (expandedLombaId === id) setExpandedLombaId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (lomba: Lomba) => {
    setEditingId(lomba.id)
    setEditTitle(lomba.name)
    setEditDescription(lomba.description)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Trophy color="var(--primary)" size={isMobile ? 22 : 28} /> Kelola Kegiatan Lomba
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Buat, edit, hapus kompetisi publik, dan pantau penempatan kategori otomatis peserta.</p>
      </div>

      {/* Grid Konten */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: isMobile ? '20px' : '32px', alignItems: 'start' }}>
        
        {/* Form Buat / Edit Lomba */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '20px 16px' : '24px', position: isMobile ? 'static' : 'sticky', top: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            {editingId ? '📝 Edit Kegiatan Lomba' : 'Buat Event Lomba'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Nama Lomba</label>
              <input type="text" placeholder="Contoh: Balap Karung HUT RI" value={editingId ? editTitle : title} onChange={e => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Deskripsi / Ketentuan</label>
              <textarea placeholder="Tuliskan aturan main atau info hadiah di sini..." value={editingId ? editDescription : description} onChange={e => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)} rows={4} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'none', fontSize: 14, fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '12px', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Batal</button>
              )}
              <button type="submit" disabled={loadingSubmit} style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', background: 'var(--primary)', color: '#000', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                {loadingSubmit ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
                {loadingSubmit ? 'Memproses...' : editingId ? 'Simpan Perubahan' : 'Buat Lomba Baru'}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Lomba dengan Tombol Aksi Lengkap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Daftar Kompetisi Aktif ({lombaList.length})</h2>
          
          {loadingFetch ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Memuat data lomba...</div>
          ) : lombaList.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Belum ada event lomba dibuat.</div>
          ) : (
            lombaList.map((lomba) => (
              <div key={lomba.id} style={{ background: 'var(--surface)', border: editingId === lomba.id ? '1px solid var(--primary)' : '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '16px' : '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* Header Card Lomba */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{lomba.name}</h3>
                    <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: '1.5', marginTop: 4 }}>{lomba.description || 'Tidak ada deskripsi.'}</p>
                  </div>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600, flexShrink: 0 }}>GRATIS</span>
                </div>
                
                {/* Bagian Bawah: Info & Tombol Kendali Admin */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12, flexWrap: 'wrap', gap: 10 }}>
                  
                  {/* Pendaftar Toggle Click */}
                  <button 
                    onClick={() => handleToggleParticipants(lomba.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: 0 }}
                  >
                    <UserCheck size={15} color="var(--primary)" /> 
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{lomba._count?.registrations || 0} Pendaftar</span>
                    {expandedLombaId === lomba.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* Tombol Aksi Edit & Hapus */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => startEdit(lomba)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Edit Lomba">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDeleteLomba(lomba.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Hapus Lomba">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* AREA DETAIL PESERTA YANG MUNGIN MUNCUL SAAT TOGGLE DI-KLIK */}
                {expandedLombaId === lomba.id && (
                  <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, marginTop: 8, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>Daftar Nama Warga Pendaftar:</h4>
                    
                    {loadingParticipants ? (
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>Memuat data warga...</div>
                    ) : participants.length === 0 ? (
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>Belum ada warga yang mendaftar pada kompetisi ini.</div>
                    ) : (
                      participants.map((p: any) => {
                        // Mengurai data string members JSON untuk mencari kategori umur otomatisnya
                        let parsedMember: any = {}
                        try { parsedMember = JSON.parse(p.members)[0] || {} } catch (e) {}
                        
                        return (
                          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '10px 12px', borderRadius: 8, fontSize: 13 }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.leaderName}</div>
                              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>WA: {p.leaderPhone} | Alamat: {p.leaderAddress}</div>
                            </div>
                            <span style={{ 
                              fontSize: 10, 
                              padding: '2px 8px', 
                              borderRadius: 12, 
                              background: parsedMember.category === 'Anak-Anak' ? 'rgba(59,130,246,0.1)' : parsedMember.category === 'Remaja' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', 
                              color: parsedMember.category === 'Anak-Anak' ? '#3b82f6' : parsedMember.category === 'Remaja' ? 'var(--primary)' : '#10b981',
                              fontWeight: 700
                            }}>
                              {parsedMember.category || 'Umum'} ({parsedMember.age || p.memberCount} Thn)
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}