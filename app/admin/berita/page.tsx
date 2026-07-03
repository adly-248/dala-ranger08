'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, Newspaper, Loader2, Pencil, X, Check } from 'lucide-react'

interface Berita {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function AdminBerita() {
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loadingFetch, setLoadingFetch] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // State untuk mode edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  // Pantau ukuran layar untuk responsivitas grid
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 1. READ
  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        setBeritaList(data)
        setLoadingFetch(false)
      })
      .catch((err) => {
        console.error(err)
        setLoadingFetch(false)
      })
  }, [])

  // 2. CREATE / UPDATE
  const handleAddOrUpdateBerita = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      handleUpdateBerita()
      return
    }

    if (!title || !content) return
    setLoadingSubmit(true)
    
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (res.ok) {
        const savedBerita = await res.json()
        setBeritaList([savedBerita, ...beritaList])
        setTitle('')
        setContent('')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSubmit(false)
    }
  }

  // 3. UPDATE
  const handleUpdateBerita = async () => {
    if (!editTitle || !editContent || !editingId) return
    setLoadingSubmit(true)

    try {
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, title: editTitle, content: editContent }),
      })

      if (res.ok) {
        const updated = await res.json()
        setBeritaList(beritaList.map(item => item.id === editingId ? updated : item))
        cancelEdit()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSubmit(false)
    }
  }

  // 4. DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus berita ini secara permanen dari database?')) return

    try {
      const res = await fetch(`/api/news?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setBeritaList(beritaList.filter((item) => item.id !== id))
      } else {
        alert('Gagal menghapus data')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (berita: Berita) => {
    setEditingId(berita.id)
    setEditTitle(berita.title)
    setEditContent(berita.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
  }

  // ==================== REVISI BAGIAN RETURN UTAMA ====================
  return (
    <div>
      {/* Header Halaman (Dibuat ringkas karena menyatu di Shared Layout) */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Newspaper color="var(--primary)" size={isMobile ? 22 : 28} /> Kelola Berita & Kegiatan
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Publikasikan informasi kegiatan Karang Taruna ke web utama.</p>
      </div>

      {/* Grid Utama Penyusun Form dan List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', // 📱 Otomatis jadi 1 kolom di HP, 2 kolom di Laptop
        gap: isMobile ? '20px' : '32px', 
        alignItems: 'start' 
      }}>
        
        {/* PANEL KIRI: Form Input (Bisa mendeteksi tambah atau edit) */}
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--border)', 
          borderRadius: 16, 
          padding: isMobile ? '20px 16px' : '24px', 
          position: isMobile ? 'static' : 'sticky', // 💻 Tetap melayang saat di-scroll jika di desktop
          top: 20 
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: editingId ? 'var(--primary)' : 'var(--text)' }}>
            {editingId ? '📝 Mode Edit Berita' : 'Buat Berita Baru'}
          </h2>
          
          <form onSubmit={handleAddOrUpdateBerita} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>Judul Berita</label>
              <input 
                type="text" 
                placeholder="Contoh: Rapat Pleno Bulan Juni" 
                value={editingId ? editTitle : title}
                onChange={e => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>Isi Pengumuman / Berita</label>
              <textarea 
                placeholder="Tuliskan detail info kegiatan di sini..." 
                value={editingId ? editContent : content}
                onChange={e => editingId ? setEditContent(e.target.value) : setContent(e.target.value)}
                required
                rows={isMobile ? 4 : 6}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'none', fontFamily: 'inherit', fontSize: 14 }} 
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {editingId && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', padding: '12px 8px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                >
                  <X size={16} /> Batal
                </button>
              )}
              <button 
                type="submit" 
                disabled={loadingSubmit}
                style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', background: 'var(--primary)', color: '#000', border: 'none', padding: '12px 8px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                {loadingSubmit ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : editingId ? <Check size={16} /> : <Plus size={16} />}
                {loadingSubmit ? 'Memproses...' : editingId ? 'Simpan' : 'Terbitkan Berita'}
              </button>
            </div>
          </form>
        </div>

        {/* PANEL KANAN: Daftar Berita Aktif */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Daftar Berita Aktif ({beritaList.length})</h2>
          
          {loadingFetch ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 14 }}>Memuat data dari database...</div>
          ) : beritaList.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
              Belum ada berita di database.
            </div>
          ) : (
            beritaList.map((berita) => (
              <div key={berita.id} style={{ 
                background: 'var(--surface)', 
                border: editingId === berita.id ? '1px solid var(--primary)' : '1px solid var(--border)', 
                borderRadius: 16, 
                padding: isMobile ? '16px' : '24px', 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', // 📱 Di HP, tombol aksi pindah ke bawah konten kartu berita
                justifyContent: 'space-between', 
                gap: isMobile ? '16px' : '20px' 
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text3)', fontSize: 11, marginBottom: 6 }}>
                    <Calendar size={12} /> {new Date(berita.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1.4 }}>{berita.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: '1.5', whiteSpace: 'pre-line' }}>{berita.content}</p>
                </div>
                
                {/* Tombol Aksi Edit & Hapus */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'row' : 'column', // 📱 Di HP berjejer horizontal sampingan
                  gap: 8,
                  justifyContent: isMobile ? 'flex-end' : 'flex-start'
                }}>
                  <button 
                    onClick={() => startEdit(berita)}
                    style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: isMobile ? 1 : 'initial' }}
                    title="Edit Berita"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(berita.id)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: isMobile ? 1 : 'initial' }}
                    title="Hapus Berita"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}