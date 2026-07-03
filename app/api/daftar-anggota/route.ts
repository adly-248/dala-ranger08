import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 1. GET: Ambil semua data pendaftaran warga
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

// 2. PUT: Update status (APPROVED / REJECTED)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const updated = await prisma.memberRegistration.update({
      where: { id },
      data: { status },
    })

    // Kirim notifikasi jika disetujui
    if (status === 'APPROVED' && updated.userId) {
      await prisma.notification.create({
        data: {
          userId: updated.userId,
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
} // ◄🌟 SEBELUMNYA KURUNG INI PINDAH KE BAWAH, SEKARANG SUDAH DI SINI

// 3. POST: Menyimpan data pendaftaran dari form publik sesuai dengan Schema Prisma kamu
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 🌟 SINKRONISASI SCHEMA: Ambil properti yang benar-benar ada di model MemberRegistration kamu
    const { fullName, birthDate, address, phone, email, education, reason } = body

    if (!fullName || !birthDate || !address || !phone || !email || !education || !reason) {
      return NextResponse.json({ error: 'Mohon isi semua data formulir dengan lengkap' }, { status: 400 })
    }

    const newRegistration = await prisma.memberRegistration.create({
      data: {
        fullName,
        birthDate: new Date(birthDate), // Pastikan diubah menjadi objek Date
        address,
        phone,
        email,
        education,
        reason,
        status: 'pending', // Sesuai default di schema kamu (huruf kecil)
      },
    })

    return NextResponse.json(newRegistration)
  } catch (error) {
    console.error("DETAIL ERROR DAFTAR ANGGOTA:", error)
    return NextResponse.json({ error: 'Gagal memproses pendaftaran' }, { status: 500 })
  }
}