'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Users, Loader2, Pencil, X, Check, Shield, User, GraduationCap } from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  role: string       // 🔑 Digunakan untuk Hak Akses: ADMIN / USER
  pangkat: string  // 🔑 Kita titipkan untuk Pangkat Organisasi: Ketua, Sekretaris, dll
}

export default function AdminAnggota() {
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [pangkat, setPangkat] = useState('Anggota Aktif') // 🌟 State baru pangkat organisasi

  const [loadingFetch, setLoadingFetch] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // State Edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('USER')
  const [editPangkat, setEditPangkat] = useState('Anggota Aktif') // 🌟 State edit pangkat

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchMembers = () => {
    fetch('/api/members')
      .then((res) => res.json())
      .then((data) => {
        setMembers(data)
        setLoadingFetch(false)
      })
      .catch(() => setLoadingFetch(false))
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingSubmit(true)

    if (editingId) {
      try {
        const res = await fetch('/api/members', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          // 🌟 Mengirim education sebagai penampung pangkat
          body: JSON.stringify({ id: editingId, name: editName, email: editEmail, role: editRole, pangkat: editPangkat }),
        })
        if (res.ok) {
          cancelEdit()
          fetchMembers()
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingSubmit(false)
      }
      return
    }

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🌟 Mengirim pangkat ke backend
        body: JSON.stringify({ name, email, password, role, pangkat: pangkat }),
      })

      if (res.ok) {
        setName('')
        setEmail('')
        setPassword('')
        setRole('USER')
        setPangkat('Anggota Aktif')
        fetchMembers()
      } else {
        const errData = await res.json()
        alert(errData.error || 'Gagal menyimpan')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus anggota ini?')) return
    try {
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        if (editingId === id) cancelEdit()
        setMembers(members.filter(m => m.id !== id))
      }
    } catch (err) { console.error(err) }
  }

  const startEdit = (m: Member) => {
    setEditingId(m.id)
    setEditName(m.name)
    setEditEmail(m.email)
    setEditRole(m.role)
    setEditPangkat(m.pangkat || 'Anggota Aktif') // Ambil pangkat yang tersimpan
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditEmail('')
    setEditRole('USER')
    setEditPangkat('Anggota Aktif')
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Users color="var(--primary)" size={isMobile ? 22 : 28} /> Kelola Anggota & Jabatan
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Daftarkan anggota, atur hak akses sistem, beserta pangkat struktural organisasi.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: isMobile ? '20px' : '32px', alignItems: 'start' }}>
        {/* PANEL KIRI: Form Panel */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '20px 16px' : '24px', position: isMobile ? 'static' : 'sticky', top: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            {editingId ? '📝 Edit Anggota' : 'Tambah Anggota Baru'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Nama Lengkap</label>
              <input type="text" value={editingId ? editName : name} onChange={e => editingId ? setEditName(e.target.value) : setName(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Email</label>
              <input type="email" value={editingId ? editEmail : email} onChange={e => editingId ? setEditEmail(e.target.value) : setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
            </div>

            {!editingId && (
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} />
              </div>
            )}

            {/* 🌟 SEPARASI 1: Pilihan Hak Akses Sistem (Role) */}
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Hak Akses Sistem *</label>
              <select
                value={editingId ? editRole : role}
                onChange={e => editingId ? setEditRole(e.target.value) : setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
              >
                <option value="USER">USER (Hanya Bisa Lihat Web)</option>
                <option value="ADMIN">ADMIN (Bisa Masuk Admin Panel)</option>
              </select>
            </div>

            {/* 🌟 SEPARASI 2: Pilihan Pangkat Struktural (pangkat) */}
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Pangkat Struktural Organisasi *</label>
              <select
                value={editingId ? editPangkat : pangkat}
                onChange={e => editingId ? setEditPangkat(e.target.value) : setPangkat(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
              >
                <option value="Ketua Karang Taruna">Ketua Karang Taruna</option>
                <option value="Wakil Ketua">Wakil Ketua</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Kepala Divisi Olahraga">Kepala Divisi Olahraga</option>
                <option value="Kepala Divisi Sosial">Kepala Divisi Sosial</option>
                <option value="Anggota Aktif">Anggota Aktif</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '12px 8px', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><X size={16} /> Batal</button>
              )}
              <button type="submit" disabled={loadingSubmit} style={{ flex: 2, padding: '12px 8px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
                {loadingSubmit ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : editingId ? <Check size={16} /> : <Plus size={16} />}
                {loadingSubmit ? 'Menyimpan...' : editingId ? 'Simpan' : 'Daftarkan Anggota'}
              </button>
            </div>
          </form>
        </div>

        {/* PANEL KANAN: List Tampilan Anggota */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Daftar Anggota Aktif ({members.length})</h2>

          {loadingFetch ? (
            <div style={{ color: 'var(--text3)', fontSize: 14, textAlign: 'center', padding: '20px' }}>Memuat data...</div>
          ) : (
            members.map((m) => (
              <div key={m.id} style={{ background: 'var(--surface)', border: editingId === m.id ? '1px solid var(--primary)' : '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '16px' : '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? '14px' : '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{m.name}</h3>
                    
                    {/* Badge Hak Akses */}
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, background: m.role === 'ADMIN' ? 'rgba(239,68,68,0.1)' : 'rgba(156,163,175,0.1)', color: m.role === 'ADMIN' ? '#ef4444' : 'var(--text2)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                      {m.role === 'ADMIN' ? <Shield size={10} /> : <User size={10} />} Sistem: {m.role}
                    </span>

                    {/* Badge Pangkat Struktural */}
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                      <GraduationCap size={10} /> {m.pangkat || 'Anggota Aktif'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4, wordBreak: 'break-all' }}>{m.email}</p>
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                  <button onClick={() => startEdit(m)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(m.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}