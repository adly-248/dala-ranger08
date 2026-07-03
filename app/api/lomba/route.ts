import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 1. GET: Ambil daftar kompetisi beserta jumlah pendaftar
export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      include: {
        _count: {
          select: { registrations: true } // Menghitung relasi tabel registrations kamu
        }
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(competitions)
  } catch (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }
}

// 2. POST: Membuat Event Lomba Baru oleh Admin
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body // 'title' dikirim dari form front-end

    if (!title) {
      return NextResponse.json({ error: 'Nama lomba wajib diisi' }, { status: 400 })
    }

    const newCompetition = await prisma.competition.create({
      data: {
        name: title, // 🌟 Diarahkan ke kolom 'name' sesuai schema kamu
        description: description || '',
        date: new Date(), // Menambahkan nilai default date agar tidak error wajib isi
        registrationFee: 0, // Sesuai request: Lomba gratis
        status: 'open',
      },
    })

    return NextResponse.json(newCompetition)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat lomba' }, { status: 500 })
  }
}