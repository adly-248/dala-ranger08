'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Image, Loader2, Pencil, X, Check, Upload } from 'lucide-react'

// 🌟 PERBAIKAN 1: Selaraskan interface dengan struktur kolom asli database kamu
interface GalleryItem {
    id: string
    title: string
    category: string | null // Digunakan sebagai penampung deskripsi teks
    url: string            // Digunakan sebagai penampung string foto base64
}

export default function AdminGaleri() {
    const [gallery, setGallery] = useState<GalleryItem[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const [loadingFetch, setLoadingFetch] = useState(true)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Edit Mode States
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editImageUrl, setEditImageUrl] = useState('')

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const fetchGallery = () => {
        fetch('/api/gallery')
            .then((res) => res.json())
            .then((data) => {
                setGallery(data)
                setLoadingFetch(false)
            })
            .catch(() => setLoadingFetch(false))
    }

    useEffect(() => {
        fetchGallery()
    }, [])

    // Fungsi mengubah file gambar menjadi string base64 secara instan
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            if (isEdit) {
                setEditImageUrl(reader.result as string)
            } else {
                setImageUrl(reader.result as string)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const activeImg = editingId ? editImageUrl : imageUrl
        if (!activeImg) return alert('Silakan pilih file foto terlebih dahulu')

        setLoadingSubmit(true)
        const payload = editingId
            ? { id: editingId, title: editTitle, description: editDescription, imageUrl: editImageUrl }
            : { title, description, imageUrl }

        try {
            const res = await fetch('/api/gallery', {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                if (!editingId) {
                    setTitle('')
                    setDescription('')
                    setImageUrl('')
                } else {
                    cancelEdit()
                }
                fetchGallery()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingSubmit(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus foto dokumentasi ini secara permanen?')) return
        try {
            const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
            if (res.ok) setGallery(gallery.filter(item => item.id !== id))
        } catch (err) { console.error(err) }
    }

    // 🌟 PERBAIKAN 2: Sesuaikan pemetaan state saat tombol edit diklik
    const startEdit = (item: GalleryItem) => {
        setEditingId(item.id)
        setEditTitle(item.title)
        setEditDescription(item.category || '')
        setEditImageUrl(item.url)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditTitle('')
        setEditDescription('')
        setEditImageUrl('')
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Image color="var(--primary)" size={isMobile ? 22 : 28} /> Galeri Dokumentasi Kegiatan
                </h1>
                <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Unggah dokumentasi foto keseruan agenda warga atau turnamen taruna.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: isMobile ? '20px' : '32px', alignItems: 'start' }}>
                {/* Input Form Panel */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '20px 16px' : '24px', position: isMobile ? 'static' : 'sticky', top: 20 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                        {editingId ? '📝 Edit Data Foto' : 'Unggah Foto Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Judul Kegiatan *</label>
                            <input type="text" placeholder="Contoh: Juara 1 Balap Karung" value={editingId ? editTitle : title} onChange={e => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Pilih File Gambar *</label>
                            <div style={{ position: 'relative', width: '100%', padding: '12px', borderRadius: 8, border: '2px dashed var(--border)', textAlign: 'center', background: 'var(--bg)', cursor: 'pointer' }}>
                                <Upload size={20} color="var(--text3)" style={{ margin: '0 auto 6px' }} />
                                <span style={{ fontSize: 12, color: 'var(--text2)', display: 'block' }}>Klik untuk memilih file</span>
                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, !!editingId)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                            </div>
                            {(editingId ? editImageUrl : imageUrl) && (
                                <img src={editingId ? editImageUrl : imageUrl} alt="Preview" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 6, marginTop: 10, border: '1px solid var(--border)', maxHeight: 300, background: 'var(--bg)' }} />
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Keterangan / Deskripsi</label>
                            <textarea rows={3} placeholder="Tulis rincian atau keseruan momen di foto..." value={editingId ? editDescription : description} onChange={e => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'none', fontFamily: 'inherit' }} />
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '12px', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}><X size={16} /> Batal</button>
                            )}
                            <button type="submit" disabled={loadingSubmit} style={{ flex: 2, padding: '12px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                {loadingSubmit ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : editingId ? <Check size={16} /> : <Plus size={16} />}
                                {loadingSubmit ? 'Mengunggah...' : editingId ? 'Simpan' : 'Simpan ke Galeri'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Grid Galeri Admin */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                    {loadingFetch ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>Memuat file galeri...</div>
                    ) : gallery.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>Belum ada foto dokumentasi.</div>
                    ) : (
                        gallery.map((item) => (
                            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <img src={item.url} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                                <div style={{ padding: 14, flex: 1 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>{item.category || 'Tidak ada deskripsi.'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => startEdit(item)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}><Pencil size={12} /></button>
                                    <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}><Trash2 size={12} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}