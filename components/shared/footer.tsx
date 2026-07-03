import Link from 'next/link'
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const Youtube = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
)

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '60px 0 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, color: '#000',
              }}>DR</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>Dala Ranger 08</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Karang Taruna</div>
              </div>
            </div>
            <p style={{ color: 'var(--text3)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Bersatu, Berkarya, Berdaya untuk Masyarakat. Karang Taruna aktif membangun generasi muda yang mandiri dan berkarakter.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: Instagram, href: '#', color: '#e1306c' },
                { icon: Facebook, href: '#', color: '#1877f2' },
                { icon: Youtube, href: '#', color: '#ff0000' },
                { icon: MessageCircle, href: '#', color: '#25d366' },
              ].map(({ icon: Icon, href, color }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{
                  width: 36, height: 36, borderRadius: 8, background: 'var(--surface)',
                  border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', transition: 'all 0.2s', color,
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 20 }}>Menu Utama</h4>
            {[
              ['/', 'Beranda'], ['/tentang', 'Tentang Kami'], ['/kegiatan', 'Kegiatan'],
              ['/berita', 'Berita'], ['/galeri', 'Galeri'], ['/lomba', 'Lomba'],
            ].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', color: 'var(--text3)', textDecoration: 'none', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}>
                → {label}
              </Link>
            ))}
          </div>

          {/* Programs */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 20 }}>Program Kerja</h4>
            {['Sosial & Kemasyarakatan', 'Olahraga & Seni', 'Lingkungan Hidup', 'Kewirausahaan', 'Pendidikan & Pelatihan'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text3)', fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 20 }}>Kontak Kami</h4>
            {[
              { icon: MapPin, text: 'Sekretariat RW 08, Kelurahan Dala, Kecamatan Ranger' },
              { icon: Phone, text: '+62 812-3456-7890' },
              { icon: Mail, text: 'info@dalaranger08.id' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <Icon size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: 'var(--text3)', fontSize: 14, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>© 2024 Karang Taruna Dala Ranger 08. Semua hak dilindungi.</p>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>Dibuat dengan ❤️ untuk masyarakat</p>
        </div>
      </div>
    </footer>
  )
}