import { prisma } from '@/lib/prisma'
import { Target, Eye, Users, Award } from 'lucide-react'

// Ganti fungsi getPengurusFromUsers di file app/tentang/page.tsx dengan ini:
async function getPengurusFromUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return users.map(u => {
    // 🌟 KINI MEMBACA DARI FIELD PANGKAT YANG BERISI PANGKAT ASLI ORGANISASI
    const jabatan = u.pangkat || 'Anggota Aktif'
    
    let kelompok = 'divisi'
    if (
      jabatan.includes('Ketua') || 
      jabatan.includes('Wakil') || 
      jabatan.includes('Sekretaris') || 
      jabatan.includes('Bendahara')
    ) {
      kelompok = 'pimpinan'
    }

    return {
      id: u.id,
      name: u.name || 'Tanpa Nama',
      position: jabatan, // Menampilkan pangkat murni (e.g. "Ketua Karang Taruna")
      type: kelompok
    }
  })
}

export default async function TentangPage() {
  // 🌟 Panggil fungsi sinkronisasi yang baru
  const pengurus = await getPengurusFromUsers()
  
  // Pisahkan data untuk pimpinan inti dan anggota divisi biasa
  const pimpinanInti = pengurus.filter(p => p.type === 'pimpinan')
  const anggotaBiasa = pengurus.filter(p => p.type === 'divisi')

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '60px 24px 40px', background: 'var(--bg2)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            <Award size={14} /> Profil Organisasi
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
            Tentang <span className="text-gradient">Dala Ranger 08</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.7 }}>
            Mengenal lebih dekat Karang Taruna Dala Ranger 08, sejarah, visi, misi, dan kepengurusan kami.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        {/* History */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', width: 36, height: 36, background: 'rgba(245,158,11,0.15)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>📜</span>
            Sejarah Kami
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div style={{ lineHeight: 1.9, color: 'var(--text2)', fontSize: 15 }}>
              <p style={{ marginBottom: 16 }}>
                Karang Taruna Dala Ranger 08 berdiri pada tahun 2008 atas inisiatif sekelompok pemuda RW 08 yang memiliki semangat tinggi untuk berkontribusi kepada masyarakat. Nama "Dala Ranger" dipilih sebagai simbol kekuatan dan penjagaan wilayah.
              </p>
              <p>
                Berawal dari kelompok kecil yang berjumlah tidak lebih dari 15 orang, kini organisasi ini telah berkembang menjadi salah satu Karang Taruna paling aktif dengan lebih dari 150 anggota aktif and berbagai program unggulan.
              </p>
            </div>
            <div style={{ lineHeight: 1.9, color: 'var(--text2)', fontSize: 15 }}>
              <p style={{ marginBottom: 16 }}>
                Selama lebih dari 15 tahun berdiri, Dala Ranger telah berhasil menyelenggarakan lebih dari 48 program kegiatan yang berdampak langsung kepada ribuan warga. Penghargaan sebagai Karang Taruna Terbaik Tingkat Kecamatan menjadi bukti nyata dedikasi kami.
              </p>
              <p>
                Dengan semangat "Bersatu, Berkarya, Berdaya", kami terus berkomitmen untuk menjadi ujung tombak pemberdayaan generasi muda yang mandiri, kreatif, dan berkarakter.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Mission */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div style={{ padding: 32, background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Eye size={24} color="var(--primary)" />
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>Visi</h3>
              </div>
              <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.8 }}>
                Menjadikan Karang Taruna RW 08 Bumi Harapan sebagai organisasi kepemudaan yang aktif, peduli terhadap lingkungan, serta mampu memberikan manfaat nyata bagi masyarakat.
              </p>
            </div>
            <div style={{ padding: 32, background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Target size={24} color="#10b981" />
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>Misi</h3>
              </div>
              <ul style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 2, paddingLeft: 0, listStyle: 'none' }}>
                {[
                  'Menyelenggarakan berbagai kegiatan sosial kemasyarakatan yang bertujuan mempererat kebersamaan, meningkatkan kepedulian, serta memberikan manfaat bagi seluruh warga RW 08.',
                  'Menginisiasi dan mengembangkan gerakan kepemudaan yang berorientasi pada kepedulian terhadap lingkungan guna mewujudkan kawasan Bumi Harapan yang bersih, asri, nyaman, dan berkelanjutan.',
                  'Menjadi wadah pengembangan kreativitas, kegiatan olahraga, serta pembinaan keagamaan dalam rangka mengoptimalkan potensi dan karakter positif pemuda-pemudi RW 08.',
                ].map((m, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: '#10b981', fontWeight: 700, marginTop: 2 }}>✓</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Structure */}
        <section>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40, textAlign: 'center', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <Users size={28} color="var(--primary)" />
            Struktur Organisasi Real-Time
          </h2>

          {/* Kolom Pengurus Inti */}
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20, textAlign: 'center' }}>Pimpinan & Pengurus Inti</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
            {pimpinanInti.map(p => (
              <div key={p.id} className="card" style={{ padding: 24, textAlign: 'center', minWidth: 180, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #b45309)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24, fontWeight: 800, color: '#000' }}>
                  {p.name[0].toUpperCase()}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>{p.name}</h4>
                <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{p.position}</p>
              </div>
            ))}
          </div>

          {/* Kolom Anggota Lainnya */}
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20, textAlign: 'center' }}>Daftar Anggota Karang Taruna</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {anggotaBiasa.map(p => (
              <div key={p.id} className="card" style={{ padding: 20, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>
                  {p.name[0].toUpperCase()}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>{p.name}</h4>
                <p style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>{p.position}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}