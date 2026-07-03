import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 1. GET: Ambil semua data warga yang mendaftar jadi anggota
export async function GET() {
  try {
    const data = await prisma.memberRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }
}

// 2. PUT: Update status pendaftaran (Disetujui / Ditolak)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body // status bisa 'APPROVED' atau 'REJECTED'

    if (!id || !status) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const updated = await prisma.memberRegistration.update({
      where: { id },
      data: { status },
    })

    // Opsional: Jika disetujui, kamu juga bisa membuatkan notifikasi otomatis di sini
    if (status === 'APPROVED') {
      await prisma.notification.create({
        data: {
          userId: updated.userId || '',
          title: 'Pendaftaran Disetujui! 🎉',
          message: 'Selamat, pendaftaran kamu sebagai anggota Karang Taruna telah disetujui oleh Admin.',
        }
      }).catch(err => console.error("Gagal buat notif:", err))
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 })
  }
}