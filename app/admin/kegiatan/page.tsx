'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, MapPin, Loader2, Pencil, X, Check } from 'lucide-react'

interface Activity {
  id: string
  title: string
  description: string
  location: string
  date: string
  category: string
}

export default function AdminKegiatan() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('sosial')

  const [loadingFetch, setLoadingFetch] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Mode Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editCategory, setEditCategory] = useState('sosial')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchActivities = () => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        setActivities(data)
        setLoadingFetch(false)
      })
      .catch(() => setLoadingFetch(false))
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingSubmit(true)

    const payload = editingId 
      ? { id: editingId, title: editTitle, description: editDescription, location: editLocation, date: editDate, category: editCategory }
      : { title, description, location, date, category }

    try {
      const res = await fetch('/api/activities', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        if (!editingId) {
          setTitle('')
          setDescription('')
          setLocation('')
          setDate('')
          setCategory('sosial')
        } else {
          cancelEdit()
        }
        fetchActivities()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kegiatan ini secara permanen?')) return
    try {
      const res = await fetch(`/api/activities?id=${id}`, { method: 'DELETE' })
      if (res.ok) setActivities(activities.filter(a => a.id !== id))
    } catch (err) { console.error(err) }
  }

  const startEdit = (a: Activity) => {
    setEditingId(a.id)
    setEditTitle(a.title)
    setEditDescription(a.description)
    setEditLocation(a.location)
    setEditDate(a.date.split('T')[0])
    setEditCategory(a.category)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Calendar color="var(--primary)" size={isMobile ? 22 : 28} /> Kelola Kegiatan Warga
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Publikasikan jadwal kerja bakti, baksos, rapat, atau acara olahraga taruna.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: isMobile ? '20px' : '32px', alignItems: 'start' }}>
        {/* Form Panel */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '20px 16px' : '24px', position: isMobile ? 'static' : 'sticky', top: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            {editingId ? '📝 Edit Kegiatan' : 'Buat Kegiatan Baru'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Nama Kegiatan *</label>
              <input type="text" value={editingId ? editTitle : title} onChange={e => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Kategori Bidang *</label>
              <select value={editingId ? editCategory : category} onChange={e => editingId ? setEditCategory(e.target.value) : setCategory(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                <option value="sosial">Sosial (Baksos / Santunan)</option>
                <option value="olahraga">Olahraga (Turnamen / Senam)</option>
                <option value="lingkungan">Lingkungan (Kerja Bakti)</option>
                <option value="kewirausahaan">Kewirausahaan (Bazar / UMKM)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Tanggal *</label>
                <input type="date" value={editingId ? editDate : date} onChange={e => editingId ? setEditDate(e.target.value) : setDate(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Lokasi Acara *</label>
                <input type="text" placeholder="RT 03 / Lapangan" value={editingId ? editLocation : location} onChange={e => editingId ? setEditLocation(e.target.value) : setLocation(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>Detail Pengumuman *</label>
              <textarea rows={4} value={editingId ? editDescription : description} onChange={e => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'none', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '12px', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}><X size={16} /> Batal</button>
              )}
              <button type="submit" disabled={loadingSubmit} style={{ flex: 2, padding: '12px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {loadingSubmit ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : editingId ? <Check size={16} /> : <Plus size={16} />}
                {loadingSubmit ? 'Memproses...' : editingId ? 'Simpan' : 'Terbitkan Acara'}
              </button>
            </div>
          </form>
        </div>

        {/* List Tampilan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Agenda Kegiatan ({activities.length})</h2>
          {loadingFetch ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>Memuat agenda...</div>
          ) : activities.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>Belum ada agenda kegiatan.</div>
          ) : (
            activities.map((a) => (
              <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '16px' : '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', background: 'var(--surface2)', padding: '3px 8px', borderRadius: 6 }}>{a.category}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 8, color: 'var(--text)' }}>{a.title}</h3>
                  <div style={{ display: 'flex', gap: 14, margin: '6px 0 10px', fontSize: 12, color: 'var(--text3)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {a.location}</span>
                  </div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.5 }}>{a.description}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 8, justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                  <button onClick={() => startEdit(a)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px', borderRadius: 8, cursor: 'pointer' }}><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(a.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: 8, cursor: 'pointer' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}