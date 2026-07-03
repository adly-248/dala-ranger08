import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import {
  Users, Calendar, Trophy, Star, ArrowRight, MapPin,
  Target, Heart, Leaf, TrendingUp, ChevronRight, Award, Newspaper,
} from 'lucide-react'

export const revalidate = 60

async function getData() {
  // 🌟 PERBAIKAN 1: Menyeimbangkan wadah penampung array kiri dengan menambahkan 'totalActivities'
  const [activities, competitions, news, totalUsers, totalCompetitions, totalActivities, totalPeserta, galleryImages] = await Promise.all([
    prisma.activity.findMany({ orderBy: { date: 'desc' }, take: 3 }),
    prisma.competition.findMany({ where: { status: 'open' }, take: 3 }),
    prisma.news.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.user.count(),
    prisma.competition.count(),
    prisma.activity.count(), // Perintah ke-6 menghitung total data kegiatan
    prisma.competitionRegistration.count(),
    prisma.gallery.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
  ])

  // 🌟 PERBAIKAN 2: Ikut sertakan 'totalActivities' ke dalam objek return agar bisa dibaca fungsi HomePage()
  return { activities, competitions, news, totalUsers, totalCompetitions, totalActivities, totalPeserta, galleryImages }
}

const categoryColors: Record<string, string> = {
  sosial: '#be123c', olahraga: '#9f1239',
  lingkungan: '#881337', kewirausahaan: '#4c0519',
}
const categoryIcons: Record<string, any> = {
  sosial: Heart, olahraga: Trophy, lingkungan: Leaf, kewirausahaan: TrendingUp,
}

export default async function HomePage() {
  const { activities, competitions, news, totalUsers, totalCompetitions, totalActivities, totalPeserta, galleryImages } = await getData()

  // 🌟 Array stats sekarang otomatis sinkron dengan data asli admin anggota dan lomba
  const stats = [
    { label: 'Total Anggota', value: String(totalUsers), icon: Users, color: '#9f1239' },
    { label: 'Total Kegiatan', value: String(totalActivities), icon: Calendar, color: '#be123c' },
    { label: 'Total Lomba', value: String(totalCompetitions), icon: Trophy, color: '#881337' },
    { label: 'Total Peserta', value: String(totalPeserta), icon: Star, color: '#9f1239' },
  ]

  const programs = [
    { title: 'Program Sosial', desc: 'Bakti sosial, santunan, dan pemberdayaan warga kurang mampu.', icon: Heart, color: '#be123c', bg: 'rgba(190,18,60,0.08)' },
    { title: 'Program Olahraga', desc: 'Turnamen, senam bersama, dan kegiatan olahraga rutin.', icon: Trophy, color: '#9f1239', bg: 'rgba(159,18,57,0.08)' },
    { title: 'Program Lingkungan', desc: 'Penanaman pohon, kebersihan, dan pelestarian lingkungan.', icon: Leaf, color: '#881337', bg: 'rgba(136,19,55,0.08)' },
    { title: 'Program Kewirausahaan', desc: 'Pelatihan usaha, bazar, dan pengembangan UMKM warga.', icon: TrendingUp, color: '#4c0519', bg: 'rgba(76,5,25,0.08)' },
  ]

  const testimonials = [
    { name: 'Alip', role: 'Ketua Tarka RW 08', text: 'Karang Taruna Dala Ranger selalu aktif dan berkontribusi nyata bagi warga. Kegiatan mereka sangat berdampak positif!' },
    { name: 'Adly', role: 'Anggota Aktif', text: 'Awalnya ngira Karang Taruna bakal ngebosenin dan cuma kumpul-kumpul biasa. Pas gabung Dala Ranger, ternyata kegiatannya seru banget, banyak pelatihan digital, dan circle-nya positif parah!' },
    { name: 'Rizky Aditya', role: 'Anggota Aktif', text: 'Bergabung dengan Dala Ranger mengubah hidup saya. Banyak ilmu dan pengalaman yang saya dapatkan di sini.' },
  ]

  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '120px 24px 80px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(159,18,57,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(190,18,60,0.05) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 300, height: 300,
          background: 'rgba(159,18,57,0.04)', borderRadius: '50%',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(159,18,57,0.08)', border: '1px solid rgba(159,18,57,0.25)',
            color: '#9f1239', padding: '8px 18px', borderRadius: 100,
            fontSize: 13, fontWeight: 600, marginBottom: 28,
          }}>
            <Star size={14} fill="currentColor" />
            Karang Taruna Terbaik Tingkat Kecamatan
          </div>

          <div style={{
            width: 120,          // Ukuran lebar logo ditingkatkan biar pas
            height: 120,        // Ukuran tinggi disamakan agar proporsional
            position: 'relative',
            margin: '0 auto 24px', // 🌟 KUNCI: Membuat logo otomatis ke tengah & memberi jarak ke teks bawah
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <Image
              src="/dalarangers.png"
              alt="Logo Karang Taruna Dala Rangers"
              fill
              sizes="120px"     // 🌟 Dioptimalkan karena ukurannya sekarang fixed 120px
              className="object-contain"
            />
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Karang Taruna
            <br />
            <span className="text-gradient">Dala Ranger 08</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'var(--text2)', marginBottom: 40, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px' }}>
            Bersatu, Berkarya, Berdaya untuk Masyarakat
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/lomba" className="btn-primary" style={{ fontSize: 15, padding: '14px 28px' }}>
              <Trophy size={18} /> Daftar Lomba
            </Link>
            <Link href="/daftar-anggota" className="btn-outline" style={{ fontSize: 15, padding: '14px 28px' }}>
              <Users size={18} /> Gabung Menjadi Anggota
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-header">
            <div className="badge"><Star size={14} /> Pencapaian Kami</div>
            <h2>Angka yang Membanggakan</h2>
            <p>Bukti nyata kontribusi Karang Taruna Dala Ranger untuk masyarakat</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="card" style={{ padding: 28, textAlign: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, margin: '0 auto 16px',
                    background: 'rgba(159,18,57,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={24} color={s.color} />
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}+</div>
                  <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(159,18,57,0.08)', border: '1px solid rgba(159,18,57,0.25)', color: '#9f1239', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              <Target size={14} /> Tentang Kami
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
              Membangun Generasi Muda yang <span className="text-gradient">Mandiri & Berkarakter</span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
              Karang Taruna Dala Ranger 08 berdiri sejak tahun 2008 sebagai wadah pemberdayaan generasi muda RW 08. Selama lebih dari 15 tahun, kami telah menjalankan berbagai program positif yang memberikan dampak nyata bagi masyarakat.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Visi', text: 'Menjadi organisasi kepemudaan yang aktif, peduli lingkungan, dan bermanfaat bagi masyarakat.' },
                { label: 'Misi', text: 'Menyelenggarakan kegiatan yang bermanfaat dan memberdayakan potensi pemuda' },
              ].map(item => (
                <div key={item.label} style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, color: '#9f1239', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
            <Link href="/tentang" className="btn-primary">
              Selengkapnya <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { num: '15+', label: 'Tahun Berdiri', color: '#9f1239' },
              { num: '100%', label: 'Dedikasi', color: '#be123c' },
              { num: '48+', label: 'Program Kerja', color: '#881337' },
              { num: String(totalUsers) + '+', label: 'Warga Terdaftar', color: '#4c0519' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 24, borderRadius: 14, textAlign: 'center',
                background: 'var(--surface)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: item.color }}>{item.num}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6, fontWeight: 500 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-header">
            <div className="badge"><Award size={14} /> Program Kerja</div>
            <h2>Bidang Program Kami</h2>
            <p>Kami bergerak aktif di berbagai bidang untuk kesejahteraan masyarakat</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {programs.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="card" style={{ padding: 28 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={24} color={p.color} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITIES */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(159,18,57,0.08)', border: '1px solid rgba(159,18,57,0.25)', color: '#9f1239', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                <Calendar size={13} /> Kegiatan Terbaru
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800 }}>Kegiatan Kami</h2>
            </div>
            <Link href="/kegiatan" className="btn-outline" style={{ fontSize: 14 }}>
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {activities.map((a) => {
              const Icon = categoryIcons[a.category] || Calendar
              const color = categoryColors[a.category] || '#9f1239'
              return (
                <div key={a.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 180, background: `linear-gradient(135deg, ${color}18, ${color}30)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <Icon size={48} color={color} style={{ opacity: 0.5 }} />
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      background: `${color}15`, border: `1px solid ${color}35`,
                      color, padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                      textTransform: 'capitalize',
                    }}> {a.category}</div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>{a.title}</h3>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 13 }}>
                        <Calendar size={13} /> {new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 13 }}>
                        <MapPin size={13} /> {a.location}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(159,18,57,0.08)', border: '1px solid rgba(159,18,57,0.25)', color: '#9f1239', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                <Trophy size={13} /> Lomba Aktif
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800 }}>Lomba Terbuka</h2>
            </div>
            <Link href="/lomba" className="btn-outline" style={{ fontSize: 14 }}>
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {competitions.map((c) => (
              <div key={c.id} className="card" style={{ padding: 24 }}>
                <div style={{
                  height: 140, borderRadius: 10, background: 'linear-gradient(135deg, rgba(159,18,57,0.1), rgba(159,18,57,0.04))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                  border: '1px solid rgba(159,18,57,0.12)',
                }}>
                  <Trophy size={40} color="#9f1239" style={{ opacity: 0.6 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, flex: 1, paddingRight: 10 }}>{c.name}</h3>
                  <span className="badge-status badge-open">Buka</span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 13 }}>
                    <Calendar size={13} /> {new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ color: '#9f1239', fontSize: 13, fontWeight: 600 }}>
                    {c.registrationFee === 0 ? 'Gratis' : `Rp ${c.registrationFee.toLocaleString('id-ID')}`}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.description}
                </p>
                <Link href={`/lomba/${c.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>
                  Daftar Sekarang <ArrowRight size={15} />
                </Link>
              </div>
            ))}
            {competitions.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--text3)' }}>
                Belum ada lomba aktif saat ini.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-header">
            <div className="badge">📷 Galeri</div>
            <h2>Dokumentasi Kegiatan</h2>
            <p>Momen berharga dari berbagai kegiatan Karang Taruna Dala Ranger 08</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
            {galleryImages.map((img) => (
              <div key={img.id} style={{
                aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
                border: '1px solid var(--border)', position: 'relative', background: 'var(--surface)'
              }}>
                {/* 🌟 MENAMPILKAN FOTO ASLI HASIL INPUT ADMIN */}
                <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(76,5,25,0.85), transparent)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 12, opacity: 0, transition: 'opacity 0.2s'
                }} className="gallery-overlay">
                  <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{img.title}</h4>
                  <p style={{ color: '#fecdd3', fontSize: 11, marginTop: 2 }}>{img.category}</p>
                </div>
              </div>
            ))}

            {galleryImages.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
                Belum ada foto dokumentasi kegiatan yang diunggah.
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/galeri" className="btn-primary">Lihat Galeri Lengkap <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(159,18,57,0.08)', border: '1px solid rgba(159,18,57,0.25)', color: '#9f1239', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                <Newspaper size={13} /> Berita Terbaru
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800 }}>Kabar Terkini</h2>
            </div>
            <Link href="/berita" className="btn-outline" style={{ fontSize: 14 }}>
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {news.map((n) => (
              <Link key={n.id} href={`/berita/${n.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 24, height: '100%' }}>
                  <div style={{ height: 160, borderRadius: 10, background: 'linear-gradient(135deg, rgba(159,18,57,0.1), rgba(159,18,57,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Newspaper size={36} color="#9f1239" style={{ opacity: 0.6 }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
                    {new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · {n.author}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: 'var(--text)' }}>{n.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="section-header">
            <div className="badge"><Star size={14} /> Testimoni</div>
            <h2>Kata Mereka</h2>
            <p>Pendapat warga dan anggota tentang Karang Taruna Dala Ranger 08</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 32, color: '#9f1239', marginBottom: 12, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #9f1239, #4c0519)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ffffff', fontSize: 14 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '60px 40px', borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(159,18,57,0.08), rgba(159,18,57,0.03))',
            border: '1px solid rgba(159,18,57,0.15)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 16 }}>
              Bergabunglah Bersama Kami!
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
              Jadilah bagian dari gerakan pemuda yang positif. Bersama Dala Ranger, kita wujudkan perubahan nyata untuk masyarakat.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/daftar-anggota" className="btn-primary" style={{ fontSize: 15, padding: '14px 28px' }}>
                Daftar Sekarang <ArrowRight size={16} />
              </Link>
              <Link href="/tentang" className="btn-outline" style={{ fontSize: 15, padding: '14px 28px' }}>
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}