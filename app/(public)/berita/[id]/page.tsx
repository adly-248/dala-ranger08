import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Newspaper } from 'lucide-react'

export default async function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await prisma.news.findUnique({ where: { id } })
  if (!article) notFound()

  const related = await prisma.news.findMany({ where: { published: true, NOT: { id } }, take: 3, orderBy: { createdAt: 'desc' } })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/berita" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text2)', textDecoration: 'none', marginBottom: 32, fontSize: 14 }}>
        <ArrowLeft size={16} /> Kembali ke Berita
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }}>
        <article>
          <div style={{ height: 320, borderRadius: 16, background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <Newspaper size={60} color="#3b82f6" style={{ opacity: 0.5 }} />
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text3)', fontSize: 14 }}>
              <Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text3)', fontSize: 14 }}>
              <User size={14} /> {article.author}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, lineHeight: 1.3, marginBottom: 28 }}>{article.title}</h1>

          <div style={{ fontSize: 16, lineHeight: 1.9, color: 'var(--text2)' }}
            dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Sidebar */}
        <aside>
          <div style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Berita Terkait</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {related.map(r => (
                <Link key={r.id} href={`/berita/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4 }}>
                      {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}