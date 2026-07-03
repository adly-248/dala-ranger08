import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 1. GET: Mengambil detail satu lomba berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const competition = await prisma.competition.findUnique({
      where: { id },
    })

    if (!competition) {
      return NextResponse.json({ error: 'Lomba tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(competition)
  } catch (error) {
    console.error("Error get detail competition:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 🌟 2. PUT: Mengupdate Nama Lomba dan Deskripsi dari Dashboard Admin
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description } = body // Mengambil data editan dari front-end

    if (!name) {
      return NextResponse.json({ error: 'Nama lomba tidak boleh kosong' }, { status: 400 })
    }

    // Eksekusi update ke database Prisma
    const updatedCompetition = await prisma.competition.update({
      where: { id },
      data: {
        name,
        description: description || '',
      },
    })

    return NextResponse.json(updatedCompetition)
  } catch (error) {
    console.error("Error updating competition:", error)
    return NextResponse.json({ error: 'Gagal memperbarui data lomba' }, { status: 500 })
  }
}

// 🌟 3. DELETE: Menghapus kegiatan lomba secara permanen dari database
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Hapus dulu data registrasi peserta yang menempel pada lomba ini agar tidak melanggar foreign key constraint
    await prisma.competitionRegistration.deleteMany({
      where: { competitionId: id }
    })

    // Baru hapus lomba utamanya
    await prisma.competition.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Kompetisi berhasil dihapus' })
  } catch (error) {
    console.error("Error deleting competition:", error)
    return NextResponse.json({ error: 'Gagal menghapus kompetisi' }, { status: 500 })
  }
}