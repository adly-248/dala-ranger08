import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Trophy, Calendar } from 'lucide-react'

export const revalidate = 0

async function getCompetitions() {
  return await prisma.competition.findMany({
    orderBy: { date: 'desc' },
  })
}

export default async function LombaPage() {
  const competitions = await getCompetitions()

  return (
    <div>
      <div style={{ padding: '60px 24px 40px', background: 'var(--bg2)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, marginBottom: 12 }}>
            🏆 Lomba Terbuka
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 16 }}>
            Daftar kompetisi dan turnamen aktif Karang Taruna Dala Ranger 08. Tunjukkan bakatmu!
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {competitions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text3)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p>Belum ada lomba aktif saat ini.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {competitions.map((c) => (
              <div key={c.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    height: 140, borderRadius: 10, background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                    border: '1px solid rgba(245,158,11,0.15)',
                  }}>
                    <Trophy size={40} color="var(--primary)" style={{ opacity: 0.7 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, flex: 1, paddingRight: 10 }}>{c.name}</h3>
                    <span className={`badge-status badge-${c.status}`}>{c.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: 13 }}>
                      <Calendar size={13} /> {new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                    <div style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>
                      {c.registrationFee === 0 ? 'Gratis' : `Rp ${c.registrationFee.toLocaleString('id-ID')}`}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                </div>
                <Link href={`/lomba/${c.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>
                  Detail & Daftar Lomba
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
