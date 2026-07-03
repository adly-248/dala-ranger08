import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 1. GET: Ambil semua data kegiatan
export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(activities)
  } catch (error) {
    console.error(error)
    return NextResponse.json([], { status: 500 })
  }
}

// 2. POST: Tambah kegiatan baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, location, date, category } = body

    if (!title || !description || !location || !date || !category) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const newActivity = await prisma.activity.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        category,
      },
    })
    return NextResponse.json(newActivity)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menambah kegiatan' }, { status: 500 })
  }
}

// 3. PUT: Update data kegiatan
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, location, date, category } = body

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        title,
        description,
        location,
        date: new Date(date),
        category,
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal memperbarui kegiatan' }, { status: 500 })
  }
}

// 4. DELETE: Hapus kegiatan berdasarkan ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID dibutuhkan' }, { status: 400 })

    await prisma.activity.delete({ where: { id } })
    return NextResponse.json({ message: 'Kegiatan berhasil dihapus' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus kegiatan' }, { status: 500 })
  }
}