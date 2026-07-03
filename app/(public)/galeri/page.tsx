import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'

export const revalidate = 0
export const dynamic = 'force-dynamic'

// 🌟 SINKRONISASI SCHEMA: Menyesuaikan properti objek agar pas dengan tabel Gallery asli kamu
interface GalleryItem {
  id: string
  title: string
  url: string       // 👈 Menggunakan url (bukan imageUrl)
  type: string
  category: string | null // 👈 Menggunakan category sebagai penampung teks/deskripsi
  createdAt: Date
}

async function getGalleryData(): Promise<GalleryItem[]> {
  return await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export default async function PublikGaleriPage() {
  const images = await getGalleryData()

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Tambahkan style tag untuk hover effect */}
      <style>{`
        .gallery-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }
        .gallery-card img {
          transition: transform 0.3s ease;
        }
        .gallery-card:hover img {
          transform: scale(1.05);
        }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>📷 Galeri Dokumentasi</h1>
        <p style={{ color: 'var(--text2)', fontSize: 15 }}>Kumpulan momen indah dan keseruan seluruh warga Karang Taruna Dala Ranger 08.</p>
      </div>

      {images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text3)', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <p>Belum ada foto dokumentasi yang diunggah.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {images.map((img) => (
            <div key={img.id} className="gallery-card">
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--surface2)' }}>
                <img
                  src={img.url}
                  alt={img.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    display: 'block',
                  }}
                />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 }}>{img.title}</h3>
                {img.category && (
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 8 }}>{img.category}</p>
                )}
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                  Diunggah: {new Date(img.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}